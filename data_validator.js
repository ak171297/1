const express = require('express')            //for using get requests
var fs = require('fs')                        //for reading files
var request = require('request');             //for requesting truecaller api
const mongodb= require('mongodb')             //for using mongo database 
const bodyParser = require('body-parser')     //to parse any body 
var csv = require('ya-csv')                   //to process csv file
const MongoClient = mongodb.MongoClient       //using mongoclient
const url = 'mongodb://localhost:27017/mydb'  //local url for database
let app = express()                           
var counts = 0                                //variable to count the number of elements in database
var score = 0                                 //score for a csv file
var ak = 0.00                                 //variable to add score each time 
var sizechk = 0.00                            //variable which stores the number of files for checking                         
MongoClient.connect(url, (err, client) => {   //creating mongodb server
  if (err) return process.exit(1)
    console.log('Kudos. Connected successfully to server')
      var db = client.db('mydb')

//get request 
app.get('/UI.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "UI.htm" ) //sending html file to the server 
  })
//get request after clicking submit button on the localhost/UI.htm  
   app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
   const Userresponse = {
    filename: req.query.filename,//filename taken from user
    chk: req.query.chk           //percent check
    };
    console.log(Userresponse)
    //adding data one by one to database from csv file
     var reader = csv.createCsvFileReader(Userresponse.filename, { columnsFromHeader: true }); 
     reader.addListener('data',async function(data) { 
       data.filename = await Userresponse.filename;
        await db.collection('queue')
         .insertOne(data, function(err, result) {
           })
     })
     //creating a async function 
        async function run(){
        //to check the number of documents using finding Number1 in the db
           reader.addListener('end', function() {
             db.collection('queue').find("Number1").count()
               .then(async function (counts) {
                 res.status(200).json(counts);//sending response to the server
                   sizechk = await call(counts)
                  //functions return the number of files to be checked
                   function call(forchk){
                     var a =  parseInt((forchk*Userresponse.chk)/100)
                      return a
                   }
  
                   //to select random elements from the database
                     await db.collection('queue').aggregate([{ $sample: { size: sizechk } }
                      ]).toArray(async function(err, result) {
                        if (err) throw err;
                           console.log(sizechk)
                         //for loop to execute each element from  database
                           for(var i=0;i<sizechk;i++){
                             await Promise.all([mainfunct(i),console.log(i),timeout(5000)])
                           }
                          //timeout function
                               function timeout(ms) {
                                return new Promise(resolve => setTimeout(resolve, ms));
                               }
                       async function  mainfunct(a){ 
                         //creating post request from truecaller api
                           await request.post(
                           'https://mnz6d8xba6.execute-api.ap-south-1.amazonaws.com/production/api/v1/search',
                            { json: { phone: result[a].Number1 } },
                             async function (error, response, body) {
                              if (!error && response.statusCode == 200) {
                                await console.log(body.result.data[0].name)//extracted data from truecaller api
                                 await console.log(result[a].Name)//data from database
            
                                 var str1 = await body.result.data[0].name//storing data from api to str1 variable
                                  var str2 = await result[a].Name//storing data from databse to string2 variable
                                   var list1 = await str2.split(" ")//splitting such that each word of name gets splitted
                                    var sizelist1 = await list1.length//length of array list1
                                     var flag  = 0
                                      for(var j=0;j<sizelist1;j++){  // loop to matching every word of str2 with str1 
                                       var string3 = await list1[j]
                                        if(string3.length>2)
                                         {var patt = await new RegExp(string3, 'ig')
                                          var resa = await str1.match(patt);
                                           if (resa!=null) {
                                            flag=1;} 
                                         }
                                       }
                                          if (flag){
                                           console.log(true)
                                            score = await 100
                                          }else{
                                           console.log(false)
                                            score = await 0
                                          }
                                            ak = await score + ak//to calculate the total score of selected data and storing it in ak
                                          
                                } 
                             }
                           )
        
                         }
                              console.log(ak/sizechk)
                              //storing score and file name as JSON and storing it in database having collection name jobs 
                                var post = await {
                                  filename:Userresponse.filename,
                                   score:ak/sizechk
                                 }

                                   db.collection('jobs').insert(post, function (err, result) {
                                    if (err) {
                                     console.log("ERROR ", err)
                                     }
                                    })
                     })
                })
           })
       }
      run()
   })
  app.listen(3000)
})