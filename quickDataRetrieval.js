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
          var print = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
          for (temp in data){
            data[temp].time = print
           
            var short = data[temp].short
            var price = data[temp].price
            var output = { price: price, date: print}
            var outputPath = "./data/Current/" + short + ".csv"
            if (cycle) {
                fs.appendFile(outputPath,json2csv({data:output,hasCSVColumnTitle: true}), function(err){
                    console.log(err)
                })
            }
            else
                var tempout = `, ${json2csv({data:output, hasCSVColumnTitle: false})}`
                fs.appendFile(outputPath, tempout, function(err){
                    console.log(err)
                })
          }
          if(cycle){cycle = false}
    })
}, 1 * 1000) 