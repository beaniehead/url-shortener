const validateURL = require("valid-url");
exports.urlparse = (req, res) => {
  
    if (validateURL.isUri(req.params.url)) {
    return req.params.url;
    } else {
    return "Is not valid URL";
    }

  }
  res.send(url1);
}