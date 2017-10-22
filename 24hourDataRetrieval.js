const request = require("request")
const json2csv = require('json2csv');
const fields = ['market_cap', 'price', 'volume'];
const https = require("https");
const fs = require('fs')
const url = "http://coincap.io/front"
const tempUrl = "http://coincap.io/history/180day/"

request(url, function(error,response, body){
    if(error||response.statusCode != 200){
        console.log("error:", error)
        console.log("statusCode:", response && response.statusCode)
    }
    else{
        console.log("success")
    }
    data = JSON.parse(body)
    data = data.slice(0,20)
    for(temp in data){
        var short = data[temp].short // value keyed at "short" in dictionary
        currentUrl = tempUrl + short
        var outputPath = "./data/" +short+".csv"
        request(currentUrl, function(error,response,body){
            if(error||response.statusCode != 200){
                    console.log("error:", error)    
                    console.log("statusCode:", response && response.statusCode)
                }
                else{
                    console.log("success")
                }
            var storage = JSON.parse(body)
            console.log(body);
            for(var i in storage){
                var model = { data: storage[i], fields: fields }
                console.log(model);
                fs.writeFile(outputPath,json2csv({data : storage[i], fields: fields}), function(err) {
                console.log(err);

                })
            }
        })
    }
})