const validateURL = require("valid-url");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const Hashids = require("hashids");


// Validates URL to tell whether or not it is a valid URL
exports.urlvalidate = ((req, res, next) => {
  // Grabs the first element of the URL - up to 'new/'
  const uriFirst = `https://${req.get('host')}/new/`;
  // Grabs the second half of the URL (the URL query);
  const uriSecond = req.originalUrl.slice(5);
  // Combines two elements of URL into new URL - NOT NEEDED
  // Validates the URL the user wants to shorten
  const urii = `${uriFirst}${uriSecond}`;
  const valid = validateURL.isWebUri(uriSecond);
  if (!valid) {
    // If valid is not true, then return an error
    res.json({error:`${uriSecond} is an invalid URL`});
  } else {
    // If url is valid, then assign uriSecond to res.locals variable so it can be accessed in next function
    res.locals.urii = uriSecond;
  // Move to next function
    next();
  }
});

// Function to shorten URL and save to database (or return shortened URL if it has previouslty been shortened and stored in DB)
exports.urlshorten = ((req, res) => {
  // URL for databse
  const url = process.env.DATABASE;
  // Connect to DB
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    console.log("Successfully connected to db");
    // Access url shortener DB
    const dbo = db.db("url-shortener");
    // Assign const to access urls collection
    const urlsCol = dbo.collection("urls");
    // Function to create unique hashid based on timestamp of request (id)
    function createHash(id) {
      const hashids = new Hashids();
      return hashids.encode(id);
    };
    // Check to see if entered url exists in database
        
    function exists(doc) {
      //return document to user
      return doc;
    };
    // Function to generate shortened URL and add to DB
    function disexists(uri) {
// Base of URL
      const base = `https://${req.get('host')}/`;
      //create hash as suffix for new url based on UNIX timestamp
      const suffix = createHash(Date.now());
      // Shortened URL string
      const newUrl = `${base}${suffix}`;
      //create new document which contains new URL and old URL
      const docToInsert = {
        oldUrl: uri,
        newUrl
      }
      // insert document into DB
      urlsCol.insert(docToInsert, (err, docs) => {
        if (err) throw err;
      });
      return ({
        oldUrl: uri,
        newUrl
      });
    }
    // Query DB to find the original URL the user entered
    urlsCol.find({
      oldUrl: {
        $eq: res.locals.urii
      }
    }, {
      // Do not return the id of the document
      projection: {
        _id: 0
      }
    }).toArray((err, doc) => {
      if (err) throw err;
      // If the document does exist return the object to the user, showing both the original URl and the new shortened URL
      if (doc[0]) {
        res.json(doc[0]);
        // If the document does not exist, then run disexists function, passing the original url as an argument to generate a new database entry
      } else {
        res.json(disexists(res.locals.urii));
      }
      db.close();
    });
  });
});

// Redirects user when a shortened URL is navigated to 
exports.redirect = ((req, res) => {
  //get current URL = included https instead of req.protocl as this mistakenly return http
  // included host instead of static address in case in case app name changes
  const newUrl = `https://${req.get('host')}${req.originalUrl}`;
  // Databse connection url
  const url = process.env.DATABASE;
  //connect to Database
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    // Variable to access url shortener databse
    const dbo = db.db("url-shortener");
    // Variable for urls collection
    const urlsCol = dbo.collection("urls");
    // find entered url in db4
    urlsCol.find({
      newUrl: {
        $eq: newUrl
      }
    }, {
      //only return original URL
      projection: {
        _id: 0,
        newUrl: 0
      }
    }).toArray((err, doc) => {
      
      if (err) throw err;
      // If doc doesn't exist
      if(!doc.length){
      console.log("Doc doesn't exist");
        res.status(404);
        //render 404 page as this is a page users will actually visit
        res.sendFile(process.cwd() + "/views/404.html");
      } else { 
        //redirect users to original URL retrieved from DB
        const redirectURL = doc[0].oldUrl;
        res.redirect(redirectURL);
      }
      db.close();
    });
  });
});