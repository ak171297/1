const express = require('express') 
var fs = require('fs')
//const logger = require('morgan')
//const errorhandler = require('errorhandler')
const mongodb= require('mongodb')
const util = require('util')
const bodyParser = require('body-parser')
var csv = require('ya-csv');
//const csv=require('fast-csv')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/mydb'
let app = express()
var counts = 0
var arr = []
//app.use(express.static('public'));
//app.use(logger('dev'))
//app.use(bodyParser.json())

MongoClient.connect(url, (err, client) => {
  if (err) return process.exit(1)
  console.log('Kudos. Connected successfully to server')
  var db = client.db('mydb');
  var collection = db.collection('jobs')

  app.get('/UI.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "UI.htm" );
 })
  app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
  Userresponse = {
     filename:req.query.filename,
     chk:req.query.chk
  };
  console.log(Userresponse);
  res.end(JSON.stringify(Userresponse));

    var reader = csv.createCsvFileReader(Userresponse.filename, { columnsFromHeader: true }); 
reader.addListener('data', function(data) { db.collection('books').insertOne(data,{'filename':Userresponse.filename},function(err, result) {
    if(!!err){
        return res.end("Error uploading files.", err);
    }else{
        res.end("File is uploaded");
    }
    });
    })
    //to add file name(but not adding)
    db.collection('books').update({},
      {$push : {"Filename":Userresponse.filename}},
      {upsert:false,
      multi:true}) 
      .then(function(updateddata){console.log('data updated');})
      //to count the number of doc(but returning the value before upload)
db.collection('books').find("Number1").count()
    .then(function(counts) {
      console.log(counts); 
      
    })
   arr =  db.collection('books')
      .find({}, { "Number1": 1, _id:0 })
      


})

  // csv.fromPath(Userresponse.filename)
  //   .on('data', function(data) {

  //     // `data` is an array containing the values
  //     // of the current line in the file
    
  //     var myobj = data;
  //     var dbo = client.db("mydb");
  //     //var myobj = JSON.stringify(data);
  //     dbo.collection("customers").insertOne(myobj, function(err, res) {
  //       if (err) throw err;
  //       console.log("1 document inserted");})
  //     console.log(myobj);

  //     })
  //   .on('end', function() {
  //     console.log('Parsing complete!')
      

  //   })
    
   
 

app.get('/mydb', (req, res) => {
  
    
    res.send(util.inspect(db.collection('books')
    .find({}, { "Number1": 1, _id:0 })))
  
  // db.collection('books')
  //     .find({}, { "Number1": 1, _id:0 })
  //     .toArray((error, number) => {
  //       client.close();
  //       if (error) return next(error)
  //       res.send(number)
      
  //     });
  //     console.log(arr)
  })
  app.listen(3000)
  // var num = db.ajay.find().toArray();
  //   (error, number) => {
    //     // if (error) return next(error)
        // console.log(number)})
})