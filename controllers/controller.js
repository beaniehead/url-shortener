const validateURL = require("valid-url");
const url = require("url");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Hashids = require("hashids");
exports.urlvalidate = (req, res, next) => {
  const urii = req.params[0];
  const valid = validateURL.isHttpsUri(urii);
  res.locals.valid = valid;
  if (!valid) {
    res.send(`${urii} is an invalid URL`)
  } else {
    res.locals.urii = urii;
    next();
  };
};
exports.urlshorten = (req, res) => {
  
  const url = process.env.DATABASE;
  // Connect to DB
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    if (err) throw err;
    console.log("Successfully connected to db");
    const dbo = db.db("url-shortener");
    // Check to see if entered url exists in database
    const urls = dbo.collection("urls");
    
    function exists(doc){
    console.log(`Document exists! See: ${JSON.stringify(doc)}`);
    }
    
    urls.find({
      oldUrl: {
        $eq: res.locals.urii
      }
    }).toArray((err, docs) => {
      if (err) throw err;
      //if the document does exist return the object to the user
    
      if(docs[0]){
      exists(docs[0]);
      }
      
      //if the document doesn't exist - 
    });
  
    
  });
  res.send(res.locals.valid);
};