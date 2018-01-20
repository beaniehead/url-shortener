const validateURL = require("valid-url");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const Hashids = require("hashids");
const url = process.env.DATABASE;

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
    // Connect to DB
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    assert.equal(null, err);
    
    console.log("Successfully connected to db");
    const dbo = db.db("url-shortener");
    // Check to see if entered url exists in database
    const urlsCol = dbo.collection("urls");

    function createHash(id) {
      const hashids = new Hashids();
      return hashids.encode(id);
    };

    function exists(doc) {
      //return document to user
      return doc;
    };

    function disexists(uri) {
      const base = "https://shortz.glitch.me/";
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
    }, {projection:{ _id: 0 }}).toArray((err, docs) => {
      if (err) throw err;
      console.log(docs);
      //if the document does exist return the object to the user
      if (docs[0]) {
        console.log("Doc exists");
        res.send(exists(docs[0]));
      } else {
        res.send(disexists(res.locals.urii));
      }
      db.close();
    });

  });
  
});

exports.redirect = ((req,res)=>{
  const newUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(newUrl);
  
  //connect to Database
  MongoClient.connect(url, (err, db)=>{
  assert.equal(null,err);
  });
  //find document which newUrl matches the newUrl
  
    //if document matches, return oldUrl from document
  
      //redirect to this documnet
    
    //if no match, close db connection and display 404 etc on page
  
  res.send(newUrl);
});