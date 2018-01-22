const validateURL = require("valid-url");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const Hashids = require("hashids");

exports.urlvalidate = ((req, res, next) => {
  const uriFirst = `https://${req.get('host')}/new/`;
  console.log(uriFirst);
  const uriSecond = req.originalUrl.slice(5);
  console.log(uriSecond);
  //const urii = req.params[0];
  const urii = `${uriFirst}${uriSecond}`;
  const valid = validateURL.isWebUri(uriSecond);
  res.locals.valid = valid;
  if (!valid) {
    res.json({error:`${uriSecond} is an invalid URL`});
  } else {
    res.locals.urii = uriSecond;
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
      //const base = "https://shorts.glitch.me/";
      const base = `https://${req.get('host')}/`;
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
      console.log(docToInsert.oldUrl);
      return ({
        oldUrl: uri,
        newUrl
      });
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
      //if the document does exist return the object to the user
      if (doc[0]) {
        console.log("Doc exists");
        res.json(doc[0]);
      } else {
        res.json(disexists(res.locals.urii));
      }
      db.close();
    });
  });
});

// Need to prevent DB connection when going to home page
exports.redirect = ((req, res) => {
  //get current URL = included https instead of req.protocl as this mistakenly return http
  // included host instead of static address in case in case app name changes
  const newUrl = `https://${req.get('host')}${req.originalUrl}`;
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
        _id: 0,
        newUrl: 0
      }
    }).toArray((err, doc) => {
      
      if (err) throw err;
      if(!doc.length){
      console.log("Doc doesn't exist");
        res.status(404);
        //render 404 page as this is a page users will actually visit
        res.sendFile(process.cwd() + "/views/404.html");
      }
      else 
       {
        
        const redirectURL = doc[0].oldUrl;
        res.redirect(redirectURL);
      }
      db.close();
    });
  });
});