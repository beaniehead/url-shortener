const validateURL = require("valid-url");
const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const hashid = require("hashids");
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
    
    urls.find({oldUrl:{$eq:res.locals.urii}})
    .toArray((err,docs)=>{
    if (err) throw err
      const id = docs[0]["_id"];
      const hash = new hashid();
      console.log(docs[0]["_id"]);
      console.log(Date.now());
      
    });
    
    //if it doesn't, then generate a url to pir
    const base = "https://shorts.glitch.me/"
    
    });
     
  res.send(res.locals.valid);
};