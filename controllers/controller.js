const validateURL = require("valid-url");
exports.urlparse = (req, res) => {
  // const urii = req.params.url;
  const urii = "https://www.google.com";
  
           if(validateURL.isHttpUri(urii)) {console.log( true)};
  res.send("Dave");
}