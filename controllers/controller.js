const validateURL = require("valid-url");
const url = require("url");
exports.urlparse = (req, res) => {
   const urii = req.params.url;
  
  
  const valid = validateURL.isHttpsUri(urii);

  console.log(req.params);
  if(!valid){
  res.send("Invalid URL")}else{res.send(valid)};
  
}