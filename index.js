var app = require('express')();
// var http = require('http').Server(app);
// var port = process.env.PORT || 3000;

var apiController = require('./controllers/apiController');

// set the view engine to ejs
app.set('view engine', 'ejs');

apiController(app);

// run server, set port
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
