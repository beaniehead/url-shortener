const validateURL = require("valid-url");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const Hashids = require("hashids");
exports.urlvalidate = ((req, res, next) => {
  const urii = req.params[0];
  const valid = validateURL.isHttpsUri(urii);
  res.locals.valid = valid;
  if (!valid) {
    res.send(`${urii} is an invalid URL`)
  } else {
    res.locals.urii = urii;
    next();
  }
});
exports.urlshorten = ((req, res) => {
  const url = process.env.DATABASE;
  // Connect to DB
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    console.log("Successfully connected to db");
    const dbo = db.db("url-shortener");
    const urlsCol = dbo.collection("urls");
    // Check to see if entered url exists in database
    function createHash(id) {
      const hashids = new Hashids();
      return hashids.encode(id);
    };

    function exists(doc) {
      //return document to user
      return doc;
    };

    function disexists(uri) {
      const base = "https://shorts.glitch.me/";
      //create hash as suffix for new url
      const suffix = createHash(Date.now());
      const newUrl = `${base}${suffix}`;
      //create new document
      const docToInsert = {
        oldUrl: uri,
        newUrl
      }
      //insert document into DB
      urlsCol.insert(docToInsert, (err, docs) => {
        if (err) throw err;
        console.log("INSERTED");
      });
      return docToInsert;
    }
    urlsCol.find({
      oldUrl: {
        $eq: res.locals.urii
      }
    }, {
      projection: {
        _id: 0
      }
    }).toArray((err, doc) => {
      if (err) throw err;
      console.log(doc);
      //if the document does exist return the object to the user
      if (doc[0]) {
        console.log("Doc exists");
        res.send(exists(doc[0]));
      } else {
        res.send(disexists(res.locals.urii));
      }
      db.close();
    });
  });
});
exports.redirect = ((req, res) => {
  const newUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
console.log(newUrl);
  const url = process.env.DATABASE;
  //connect to Database
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    console.log("Connected");
    const dbo = db.db("url-shortener");
    const urlsCol = dbo.collection("urls");
   urlsCol.find({
      newUrl: {
        $eq: newUrl
      }
    }, {
      projection: {
        _id: 0
      }
    }).toArray((err, doc) => {
      if (err) throw err;
      if (doc) {
        console.log(doc[0])
      }
      db.close();
    });
  });
  //find document which newUrl matches the newUrl
  //if document matches, return oldUrl from document
  //redirect to this documnet
  //if no match, close db connection and display 404 etc on page
  res.send(newUrl);
});