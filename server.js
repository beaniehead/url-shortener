// server.js
// where your node app starts

// init project
const fs = require('fs');
const express = require('express');
const routes = require('./routes/index.js');

const app = express();

require('dotenv').config();

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
