var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

var apiController = require('./controllers/apiController');

// set the view engine to ejs
app.set('view engine', 'ejs');

apiController(app);

// run server, set port
http.listen(port, function(){
  console.log('listening on port:3000');
});
