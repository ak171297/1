const express = require('express') 
//const logger = require('morgan')
//const errorhandler = require('errorhandler')
const mongodb= require('mongodb')
const bodyParser = require('body-parser')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/mydb'
let app = express()
//app.use(logger('dev'))
//app.use(bodyParser.json())
MongoClient.connect(url, (err, client) => {
  if (err) return process.exit(1)
  console.log('Kudos. Connected successfully to server')
  app.get('/mydb', (req, res) => {
    var db = client.db('mydb');

  var arr = db.collection('ajay')
      .find({}, { Number1: 1, _id:0 })
      .toArray((error, number) => {
        client.close();
        if (error) return next(error)
        res.send(number)
        console.log(arr)
      });
      
  })
  app.listen(3000)
  // var num = db.ajay.find().toArray();
  //   (error, number) => {
    //     // if (error) return next(error)
        // console.log(number)})
})