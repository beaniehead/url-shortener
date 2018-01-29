// server.js
// where your node app starts

// init project
const fs = require('fs');
const express = require('express');
const routes = require('./routes/index.js');

const app = express();

require('dotenv').config();

if (!process.env.DISABLE_XORIGIN) {
  app.use((req, res, next)=> {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.use('/', routes);

// Respond not found to all the wrong routes
app.use((req, res, next)=>{
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use((err, req, res, next)=> {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT,()=> {
  console.log('Node.js listening ...');
});
