const express = require('express') 
var fs = require('fs')
var sa = require('superagent');
var request = require('request');
var stringSimilarity = require('string-similarity');
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
var score = []
var sizechk = 0
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
    const Userresponse = {
      filename: req.query.filename,
      chk: req.query.chk
    };
    console.log(Userresponse);
    var reader = csv.createCsvFileReader(Userresponse.filename, { columnsFromHeader: true }); 
    reader.addListener('data', function(data) {
      data.filename = Userresponse.filename;
      //console.log(data);
      db.collection('books')
        .insertOne(data, function(err, result) {
        })
    })
    async function run(){
    reader.addListener('end', function() {
      db.collection('books').find("Number1").count()
      .then(async function (counts) {
        res.status(200).json(counts);
        sizechk = await call(counts)
       
        function call(forchk){
         var a =  (forchk*Userresponse.chk)/100
          return a
           }
  
  
    await db.collection('books').aggregate([{ $sample: { size: sizechk } }
    ]).toArray(async function(err, result) {
      if (err) throw err;
      console.log(sizechk)
      
       for(var i=0;i<sizechk;i++)
        {
      await Promise.all([mainfunct(i),console.log(i),timeout(5000)])
        }
        function timeout(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
      }
        async function  mainfunct(a){ 
           
        //console.log(result[a].Number1)
        // console.log(result[a].Name)
        await request.post(
          'https://mnz6d8xba6.execute-api.ap-south-1.amazonaws.com/production/api/v1/search',
          { json: { phone: result[a].Number1 } },
          async function (error, response, body) {
              if (!error && response.statusCode == 200) {
                await console.log(body.result.data[0].name)
                await console.log(result[a].Name)
            
                var str1 = await body.result.data[0].name
                var patt = await new RegExp(/result[a].Name/ig)
                var resa = await patt.test(str1);
                console.log(resa)
                      //if (resa) {
                        //await console.log(body.result.data[0].name)
                        //await console.log(result[a].Name)
                        //await console.log(true);
              //        //  score[a] = 100
                    //} else {
                        //await console.log(false);
                       // await console.log(body.result.data[0].name)
                  //await console.log(result[a].Name)
              //          //score[a] = 0
                    //}
              //      //var fscore = fscore+score[i];
              //     // var average = fscore/i;
              //     // res.status(200).json(average)                             
              }
          }
      );
    }
    });
  })
})
}
run();
  })
  app.listen(3000)

})