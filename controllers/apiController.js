var express = require('express');
var app = require('express')();
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function(app) {


app.get('/', function(req, res) {
        res.render('hello');
});
app.get('/eng', function(req, res) {
        res.render('engineroom');
});


//static route - style, js, images, etc
app.use('/assets', express.static('./public'));
};
