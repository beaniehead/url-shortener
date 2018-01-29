const express = require('express');
const fs = require('fs');
const controller = require('../controllers/controller');

const router = express.Router();

router.get("/", (req,res)=>{
res.sendFile(process.cwd() + "/views/index.html");
});

router.get("/new/:url", controller.urlvalidate, controller.urlshorten);

router.get("/*", controller.redirect);

module.exports = router;