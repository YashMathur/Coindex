const express = require('express')
var browserify = require('browserify-middleware');
var crypto = require('crypto');
var Promise = require("bluebird");
var request = require('request-promise');
var gdax = require('gdax');
var publicClient = new gdax.PublicClient();

publicClient.productID = 'ETH-USD';


// publicClient.getProductHistoricRates({'start': '2017-07-01T14:07:15-07:00', 'end': '2017-07-25T14:07:15-07:00', 'granularity': 86400}, function(err, response, data) {
//     console.log(data)
// });

var urls = [];
var baseUrl = "https://api.gdax.com/products/ETH-USD/candles?";

var start = 0;

for (var i=1;i<=175;++i) {
  var e = new Date();
  var s = new Date();

  s.setMinutes(s.getMinutes() - start*3000);
  e.setMinutes(e.getMinutes() - i*3000 + 15);

  publicClient.getProductHistoricRates({'start': e.toISOString(), 'end': s.toISOString(), 'granularity': 900}, function(err, response, data) {
    console.log(data)
  });

  var obj = {
    url: `${baseUrl}&start=${e.toISOString()}&end=${s.toISOString()}&granularity=900`,
    headers: {
      'User-Agent': 'Coindex',
      'Content-Type': 'application/json'
    }
  }
  // if (i==1)
  urls.push(obj);
  start = i;
}

// console.log(urls);

// Promise.map(urls, function(obj) {
//   return request(obj).then(function(body) {
//     return Promise.delay(1000, JSON.parse(body));
//   });
// }, {concurrency: 1}).then(function(results) {
//   console.log(results);
//   for (var i = 0; i < results.length; i++) {
//     // access the result's body via results[i]

//   }
// }, function(err) {
//   // handle all your errors here
//   console.log(err);
// });

const app = express()
const port = 5000

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

app.use(allowCrossDomain)
app.use(express.static(__dirname + '/public'))

app.get('/app.js', browserify('./client/main.js'));
app.get('/style', browserify('./public/'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.listen(process.env.PORT || port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
