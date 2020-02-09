'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true});

var Schema = mongoose.Schema;
var urlSchema = new Schema({
  url: String
})
var urlModel = mongoose.model('Url', urlSchema)
app.use(cors());
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());
/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl/new", function (req, res) {
  console.log(req.body.url)
  let url = new urlModel({url: req.body.url})
  urlModel.create({url: req.bodyfunction (err, result) {
    if (err) return err;
    console.log(result);
    res.json({success:true})
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});