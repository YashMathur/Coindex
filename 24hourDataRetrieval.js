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
    
    var listofUrls = []
    var listofOutputPaths = []
    data = JSON.parse(body)
    data = data.slice(0,20)
    for(temp in data){
        var short = data[temp].short // value keyed at "short" in dictionary
        currentUrl = tempUrl + short
        var outputPath = "./data/Predict/" +short+".csv"
        listofOutputPaths.push(outputPath)
        listofUrls.push(currentUrl)
    }
    d = new Date()
    var print = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    for(temp in listofUrls){
        request(listofUrls[temp], function(error, response, body){
            if(error||response.statusCode != 200){
                console.log("error:", error)    
                console.log("statusCode:", response && response.statusCode)
            }
            else{
                console.log("success")
            }
            var storage = JSON.parse(body)

            console.log(storage.market_cap)
            for(i in storage){
                var d = new Date(i[0][0])
                var print = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
                var output = {market_cap: i[i][1], price: storage.price[i][1], volume: storage.volume[i][1], date:print}
                fs.writeFile(outputPath[temp],json2csv({data : storage[i], fields: fields}), function(err) {
                    console.log(err);
                })
            }
        })
    }
})