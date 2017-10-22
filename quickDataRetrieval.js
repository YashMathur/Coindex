const request = require("request")
const json2csv = require('json2csv');
var fields = ['price', 'date'];
const https = require("https");
const fs = require('fs')
const url = "http://coincap.io/front"
var cycle = true
setInterval(function(){
    request(url, function(error,response,body){
        if(error||response.statusCode != 200){
            console.log("error:", error)
            console.log("statusCode:", response && response.statusCode)
          }
          else{
            console.log("success")
          }
          data = JSON.parse(body)
          data = data.slice(0,20)
          //console.log(data)
          d = new Date()
          for (temp in data){
            var short = data[temp].short
            var price = data[temp].price
            var output = { price: price, date: d}
            var outputPath = "./data/" + short + ".csv"
            if (cycle) {
                fs.appendFile(outputPath,json2csv({data:output,hasCSVColumnTitle: true}) +'\n', function(err){
                })
            }
            else{
                fs.appendFile(outputPath,json2csv({data:output, hasCSVColumnTitle: false}) + '\n', function(err){  
                })
            }
          }
          if(cycle){cycle = false}
    })
}, 5 * 1000) 
