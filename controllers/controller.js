const validateURL = require("valid-url");
const url = require("url");
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
  console.log("Next");
  res.send(res.locals.valid);
};