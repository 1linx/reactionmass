var app = require('express')();

// set the view engine to ejs
app.set('view engine', 'ejs');
var expressSanitizer = require('express-sanitizer');
// Mount express-sanitizer here
app.use(expressSanitizer());


var apiController = require('./controllers/apiController');

apiController(app);

// run server, set port
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
