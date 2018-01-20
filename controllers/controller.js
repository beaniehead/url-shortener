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
  MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    if (err) log err;
    console.log("Successfully connected to db");
    const dbo = db.db("url-shortener");
    //logic - check to see if entered url exists in database
    const urls = dbo.collection("urls");
    urls.find({
      oldUrl: {
        $eq: res.locals.urii
      }
    }).toArray((err, docs) => {
      if (err) throw err;
      //if the document does exist return the object to the user
      exists = true;
      //if the document doesn't exist - 
      
       
      
      // 1. generate a suffix for new url (using a hash of the timestamp)
      // 2. creat object with new url and old url
      // 3. add this to db as new databse
      
      //option 2 is simpler - just need to generate the suffix
        //create unique has suffix based on the 
        const id = (docs[0]["_id"]).toString();
        function createHash(id) {
          const hashids = new Hashids();
          return hashids.encodeHex(id);
        };
        const base = "https://shorts.glitch.me/"
         const suffix = createHash(id);
        console.log(suffix)
       
        // return old and new url as json object to user
      
    });
  });
  res.send(res.locals.valid);
};