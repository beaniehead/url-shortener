const validateURL = require("valid-url");
const url = require("url");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

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
  
  MongoClient.connect(url,(err,db)=>{
  assert.equal(null,err);
    console.log("Successfully connected to db");
    const dbo = db.db("url-shortener");
    //logic - check to see if entered url exists in database
    const urls = dbo.collection("urls");
    console.log(res.locals.urii);
    urls.find({oldUrl:{$eq:res.locals.urii}})
    .toArray((err,docs)=>{
    if (err) throw err;
      console.log(docs);
    });
    
    //if it doesn't, then generate a url to pir
      
    });
     
  res.send(res.locals.valid);
};