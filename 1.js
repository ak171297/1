const express = require('express') 
var fs = require('fs')
var request = require('request');
const mongodb= require('mongodb')
const bodyParser = require('body-parser')
var csv = require('ya-csv');
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017/mydb'
let app = express()
var counts = 0
var arr = []
var score = 0
var ak = 0.00
var sizechk = 0.00
var fscore = 0
var average = 0
MongoClient.connect(url, (err, client) => {
  if (err) return process.exit(1)
    console.log('Kudos. Connected successfully to server')
   var db = client.db('mydb');
   var collection = db.collection('books')

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
     reader.addListener('data',async function(data) {
       data.filename = await Userresponse.filename;
        await db.collection('books')
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
         var a =  parseInt((forchk*Userresponse.chk)/100)
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
           
        await request.post(
          'https://mnz6d8xba6.execute-api.ap-south-1.amazonaws.com/production/api/v1/search',
          { json: { phone: result[a].Number1 } },
          async function (error, response, body) {
              if (!error && response.statusCode == 200) {
                await console.log(body.result.data[0].name)
                await console.log(result[a].Name)
            
                var str1 = await body.result.data[0].name
                var str2 = await result[a].Name
                var list1 = await str2.split(" ")
                var sizelist1 = await list1.length
                var flag  = 0
                for(var j=0;j<sizelist1;j++)
                {
                  var string3 = await list1[j]
                  if(string3.length>2)
                  {var patt = await new RegExp(string3, 'ig')
                  var resa = await str1.match(patt);
                    if (resa!=null) {
                      flag=1;} 
                  }
                }
                       if (flag) {
                         console.log(true)
                         score = await 100
                       }else{
                         console.log(false)
                       score = await 0
                    }
                    ak = await score + ak
                                          
              }
          }
        )
        
      }
      console.log(ak/sizechk)
    });
  })
})
      }
run();
  })
  app.listen(3000)

})