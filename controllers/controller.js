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
  let exists = false;
  const url = process.env.DATABASE;
  // Connect to DB
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    if (err) throw err;
    console.log("Successfully connected to db");
    const dbo = db.db("url-shortener");
    // Check to see if entered url exists in database
    const urls = dbo.collection("urls");
    const results = urls.find({
      oldUrl: {
        $eq: res.locals.urii
      }
    }).toArray((err, docs) => {
      if (err) throw err;
      //if the document does exist return the object to the user
      console.log(docs[0]);
      exists = true;
      return docs[0];
      //if the document doesn't exist - 
    });
    console.log(results);
    
  });
  res.send(res.locals.valid);
};