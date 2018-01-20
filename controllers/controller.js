const validateURL = require("valid-url");
const url = require("url");
const mongoose = require('mongoose');
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
  // Connect to our Database and handle any bad connections
  mongoose.connect(process.env.DATABASE, (err) => {
    if (!err) console.log("connected");
  });
  mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
  mongoose.connection.on('error', (err) => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
  });
  res.send(res.locals.valid);
};