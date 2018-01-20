const validateURL = require("valid-url");
exports.urlparse = (req, res) => {
  const enteredUrl = req.params.url;
const dave = { if(validateURL.isHttpUri(enteredUrl)) return true;
  
  res.send(req.params.url);
}