var Backbone = require('backbone');
var blockstack = require('blockstack');

var STORAGE_FILE = 'coindex.json';

const ETH = "eth";
const BIT = "bit";

var DashboardPage = Backbone.View.extend({
  display: function(){
    var portfolio;
    var wallets;
    var transactions;

    function fetchTransactions(type, address) {

    }

    function add(wallet){
      return blockstack.putFile(STORAGE_FILE, wallet);
    }

    blockstack.getFile(STORAGE_FILE, true).then((portfolioJson) => {
      portfolio = JSON.parse(portfolioJson).results[0];
      // console.log(portfolio);
    });

    portfolio = {
      wallets: ['1', 'fjd']
    };

    wallets = portfolio.wallets;
    if (wallets.length == 0) {
      $(".transaction-container").html('<span>No Recent Transactions</span>');
      $(".portfolio-item").html('<button> Add </button>');
    } else {
      wallets.forEach(function(type, address) {
        console.log(address);
        // transactions.push(fetchTransactions(type, address));

      });
    }
  },

});

$(function() {
  var dashboardPage = new DashboardPage();
  dashboardPage.display();
});
