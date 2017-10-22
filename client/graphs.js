var Promise = require("bluebird");
var request = require('request-promise');
var https = require('https');
var Backbone = require('backbone');

var gainersUrl = 'https://coincap.io/front';
var gainers = [];

var Graph = Backbone.View.extend({
  render: function() {
    https.get(gainersUrl, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        body = JSON.parse(body);

        for (var i=0;i<5;++i) {
          var obj = {
            name: body[i].long,
            symbol: body[i].short,
            price: body[i].price,
            change: body[i].perc
          }
          gainers.push(obj);
        }

        gainers.forEach(function(gainer) {
          $(".gainers-container").append(`<div>${gainer.name}(${gainer.symbol}) - ${gainer.price} (${gainer.change})</div>`);
        });
      });
    });

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
  }
});

$(function() {
  var graph = new Graph();
  graph.render();
});
