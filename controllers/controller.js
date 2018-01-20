const parse = require("url-parse");

exports.urlparse = (req,res) =>{


res.send(req.params);
}