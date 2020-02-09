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
mongoose.connect(process.env.MONGOLAB_URI);
var Schema = mongoose.Schema;
var urlSchema = new Schema({
  shortUrl: Number,
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
  let newUrl
  try {
    newUrl = new URL(req.body.url)
  } catch {
    res.json({error: 'Invalid URL'})
  }
  urlModel.findOne({url: req.body.url}, function (err, result) {
    if (!result) {
      urlModel.findOne().sort({shortUrl:-1}).limit(1).exec(function (err, idResult) {
        console.log('id result: ' + idResult.shortUrl)
        urlModel.create({url: req.body.url, shortUrl: idResult.shortUrl + 1}, function (err, result) {
          if (err) return err;
          console.log(idResult);
          res.json({success: true})
        }) 
      })
    } else {
      console.log(result)
      res.json({original_url: req.body.url, short_url: result.shortUrl})
    }
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});