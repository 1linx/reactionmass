var bodyParser = require('body-parser');
var express = require('express');
// var app = require('express')();

// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var jsesc = require('jsesc');

// postgreSQL settings
var pgp = require('pg-promise')(/*options*/)
var db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/alwarmington')

module.exports = function(app) {

// READ
app.get('/', function(req, res) {
  var engineRoomData = {};
  db.query("SELECT * FROM engineroom ")
    .then(function (data) {
      console.log(JSON.stringify(data));
      data.forEach(function(datas) {
        engineRoomData[datas['name']] = datas['value'];
      });
      console.log(engineRoomData);
      res.render('engineroom', {
          data: engineRoomData
      });
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    })
});

// CREATE
app.post('/api/v1/post', urlencodedParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  } else  {
  req.body.rowNameSan = req.sanitize(req.body.createRowName);
  req.body.rowValSan = req.sanitize(req.body.createRowVal);
  var data = req.body;
  console.log('...POSTING... ' + jsesc(data.rowNameSan) + ': ' + jsesc(data.rowValSan));

  db.none('INSERT INTO engineroom(name, value) VALUES(${name}, ${value})', {
    name: jsesc(data.rowNameSan),
    value: jsesc(data.rowValSan)
  })
  .catch(function (error) {
      console.log('ERROR:', error)
    });;
  res.send('Data received: ' + req.body.sanitized);
}
});

// UPDATE
app.put('/api/v1/put', urlencodedParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  } else  {
  req.body.rowIdSan = req.sanitize(req.body.rowId);
  req.body.fuelValSan = req.sanitize(req.body.fuelVal);
  var data = req.body;
  console.log('...UPDATING... ' + jsesc(data.rowIdSan) + ': ' + jsesc(data.fuelValSan));
  db.none('UPDATE engineroom SET value = $1 WHERE name = $2', [jsesc(data.fuelValSan), jsesc(data.rowIdSan)])
  .catch(function (error) {
      console.log('ERROR:', error)
    });;
  res.send('Data received: ' + req.body.sanitized);
  }
});

// DELETE
app.delete('/api/v1/delete', urlencodedParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  } else  {
  req.body.rowNameSan = req.sanitize(req.body.rowName);
  var data = req.body;
  console.log('...DELETING... ' + jsesc(data.rowNameSan));
  db.none('DELETE FROM engineroom WHERE name=($1)', jsesc(data.rowNameSan))
  .catch(function (error) {
      console.log('ERROR:', error)
    });;
  res.send('Data received: ' + req.body.sanitized);
  }
});

//static route - style, js, images, etc
app.use('/assets', express.static('./public'));
};


// CRUD controls to be used on front-end.

// $('#createForm').submit(function(e){
//   console.log('Creating:');
//   console.log($('#createForm').serialize());
//   e.preventDefault();
//   $.ajax({
//     url:'/api/v1/post/',
//     type:'post',
//     data:$('#createForm').serialize(),
//     success:function(){
//       console.log('success');
//     return false;
//     }
//   });
// });

// $('#delForm').submit(function(e){
//   console.log('Deleting:');
//   console.log($('#delForm').serialize());
//   e.preventDefault();
//   $.ajax({
//     url:'/api/v1/delete/',
//     type:'delete',
//     data:$('#delForm').serialize(),
//     success:function(){
//       console.log('success');
//     return false;
//     }
//   });
// });
//
// $('#fuelForm').submit(function(e){
//     console.log('Submitted: ');
//     console.log($('#fuelForm').serialize());
//   e.preventDefault();
//   $.ajax({
//   url:'/api/v1/put/',
//   type:'put',
//   data:$('#fuelForm').serialize(),
//   success:function(){
//     console.log('success');
//   return false;
//   }
//   });
// });
