var Promise = require("bluebird");
var request = require('request-promise');

var urls = [
  'http://coincap.io/history/365day/BTC',
  'http://coincap.io/history/365day/ETH',
  'http://coincap.io/history/365day/LTC'
];

var x = [];

Promise.map(urls, function(obj) {
  return request(obj).then(function(body) {
    return JSON.parse(body);
  });
}).then(function(results) {
  for (var i = 0; i < results.length; i++) {
    x[i] = results[i].price;
  }

  res = [];

  for (var i=0;i<x[0].length;++i) {
    var t = [];
    for (var j=0;j<x.length;++j) {
      if (!j) {
        var d = new Date(x[j][i][0]);
        x[j][i][0] = d;
        t.push(x[j][i][0]);
      }
      t.push(x[j][i][1]);
    }
    res.push(t);
  }

  google.charts.load('current', {'packages':['annotationchart']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'BTC');
    data.addColumn('number', 'ETH');
    data.addColumn('number', 'LTC');
    data.addRows(res);

    var chart = new google.visualization.AnnotationChart(document.getElementById('chart_div'));

    var options = {
      displayAnnotations: false,
      displayRangeSelector: false,
      fill: 50
    };

    chart.draw(data, options);
  }

}, function(err) {
  console.log(err);
});
