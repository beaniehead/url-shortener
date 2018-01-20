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
    next();
  };
};
exports.urlshorten = (req, res) => {
  const url = process.env.DATABASE;
  
  MongoClient.connect(url,(err,db)=>{
  assert.equal(null,err);
    console.log("Successfully connected to db");
    
    db.close();
  
  });
  
  
  
  
  
  
  
  
  // // Connect to our Database and handle any bad connections
  // mongoose.connect(process.env.DATABASE, (err) => {
  //   if (!err) console.log("connected");
  // });
  // mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
  // mongoose.connection.on('error', (err) => {
  //   console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
  // });
  res.send(res.locals.valid);
};