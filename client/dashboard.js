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

    function add(wallet){
      return blockstack.putFile(STORAGE_FILE, wallet);
    }

    blockstack.getFile(STORAGE_FILE, true).then((portfolioJson) => {
      portfolio = JSON.parse(portfolioJson).results[0];
      // console.log(portfolio);
    });

    portfolio = {
      wallets: [
        {
          wallet_name: 'bit',
          address: '0x6764387ryu4r737346847'
        }
      ]
    };

    wallets = portfolio.wallets;
    if (wallets.length == 0) {
      $(".portfolio-item").html('<button> Add </button>');
    } 
    else {
      wallets.forEach(function(data) {
        console.log(data);
        $(".portfolio-item-container").append('<div class="portfolio-item">  <div class="CryptoCurrencyType">'+data.wallet_name+'</div> <div class="Percent-of-Portfolio"> 59% </div><div class="CryptoCurrencyVal">0.09 BTC</div><div class="USD">USD$760</div></div>')


      });
    }
  },

});

$(function() {
  var dashboardPage = new DashboardPage();
  dashboardPage.display();
});
