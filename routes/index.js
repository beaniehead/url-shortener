const express = require('express');
const fs = require('fs');
const controller = require('../controllers/controller');

const router = express.Router();
// Route to homepage
router.get("/", (req,res)=>{
res.sendFile(process.cwd() + "/views/index.html");
});

// Route to users shortening a URL
router.get("/new/*", controller.urlvalidate, controller.urlshorten);


// Route for redirecting URLS
router.get("/*", controller.redirect);

module.exports = router;