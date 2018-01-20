const validateURL = require("valid-url");
const url = require("url");
exports.urlparse = (req, res) => {
  // const urii = req.params.url;
  const urii = "https://www.google.com";
  
  if (validateURL.isHttpsUri(urii)) {
    return urii
  } else {
    return "SHIT!";
  };
  res.send("Dave");
}