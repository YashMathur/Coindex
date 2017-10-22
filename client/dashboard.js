var Backbone = require('backbone');
var blockstack = require('blockstack');

const https = require("https");

var STORAGE_FILE = 'coindex.json';

const ETH = "eth";
const BTC = "btc";
const LTC = "ltc";
const ethScanApiKey = "1W56HIJ9HQDWG3WRRTBANU3K7X3TB96P8Y";

var DashboardPage = Backbone.View.extend({
  display: function(){
    var portfolio;
    var wallets;
    var transactions = [];
    var selectedType = BTC; // By default

    $('#addDialog-button').click(function(event) {
      event.preventDefault();
      $('#addDialog').toggle();
    });

    $('#add-wallet-button').click(function(event) {
      event.preventDefault();
      //save the address
      var newAddress = document.getElementById('wallet-address').value;

      //TODO: CHECK UNIQUENESS OF ADDRESS BEFORE ADDING
      var newWallet = {"type": selectedType,
                       "address": newAddress}

      portfolio.wallets.push(newWallet);

      // Fetch wallet info and popluate the Your Portfolio section
      fetchWalletInfo(selectedType, newAddress);
      $('#addDialog').toggle();
    });

    $('#btc-type-button').click(function(event) {
      event.preventDefault();
      selectedType = BTC;
    });

    $('#eth-type-button').click(function(event) {
      event.preventDefault();
      selectedType = ETH;
    });

    $('#ltc-type-button').click(function(event) {
      event.preventDefault();
      selectedType = LTC;
    });

    function fetchWalletInfo(type, address) {
      var walletValue = "";
      var typeName = "";
      var url = "";

      switch(type) {
        case BTC:
          url = `https://blockchain.info/q/addressbalance/${address}`;
          typeName = "bitcoin";
          https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
              data += chunk;
              var p = JSON.parse(data);
              walletValue = parseFloat(p)*Math.pow(10, -8);
              getPriceUSD(type, typeName, walletValue);
            });
          });
          break;

        case ETH:
          url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ethScanApiKey}`;
          typeName = "ethereum";
          https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
              data += chunk;
              var p = JSON.parse(data);
              walletValue = parseFloat(p.result)*Math.pow(10, -18);
              getPriceUSD(type, typeName, walletValue);
            });
          });
          break;

        case LTC:
          break;

        default:
          break;
      }
    }

    function getPriceUSD (type, typeName, walletValue) {
      var url = `https://api.coinmarketcap.com/v1/ticker/${typeName}/`;
      https.get(url, (res) => {
        let data = '';
       
        res.on('data', (chunk) => {
          data += chunk;
          var p = JSON.parse(data);
          console.log(p[0]);
          var priceUSD = p[0].price_usd;
          var coinValueUSD = walletValue*parseFloat(priceUSD);

          if (portfolio.totalUSD) {
            portfolio.totalUSD += coinValueUSD;
          } else {
            portfolio.totalUSD = coinValueUSD;
          }
          console.log(coinValueUSD + " " + portfolio.totalUSD);

          var percent = coinValueUSD*100/portfolio.totalUSD;

          populatePortfolio(type, percent, walletValue, coinValueUSD);
          // blockstack.putFile(STORAGE_FILE, JSON.stringify(portfolio));
        });
      });
    }

    function fetchTransactions(type, address) {
      switch(type) {
        case ETH:
          var ethTransUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ethScanApiKey}`;
          https.get(ethTransUrl, (res) => {
            let data = '';

            // A chunk of data has been recieved.
            res.on('data', (chunk) => {
              data += chunk;
              var p = JSON.parse(data);

              p.result.forEach(function(trans) {
                var date = new Date(trans.timeStamp*1000);
                date = date.toDateString().substring(4, 10);
                var singleTransaction = {
                  "date": date,
                  "from": trans.from,
                  "to": trans.to,
                  "value": parseFloat(trans.value)*Math.pow(10, -18),
                  "type": ETH
                };
                // console.log(singleTransaction);
                transactions.push(singleTransaction);
              });
              // console.log(transactions);
              //TODO: Actually sort the transactions by recent date
              transactions.reverse();
              showTransactions();
            });
          });
          break;

        case BTC:

          break;

        default:
          break;
      }
    }

    function populateRecentTransactions(date, transText, transVal, transType) {
      $(".transaction").append(`<div class="transaction-container"> <div class="transaction-common transaction-date-container">${date}</div> <div class="transaction-common transaction-type--graphic">AB</div> <div class="transaction-common transaction-type--text">${transText}</div> <div class="transaction-common transaction-value">${transVal} <span>${transType}</span></div> </div>`);
    }

    function populatePortfolio(type, portPercent, value, usdExch) {
      var typeName = "";
      switch(type) {
        case BTC:
          typeName = "Bitcoin";
          break;

        case ETH:
          typeName = "Ethereum";
          break;

        case LTC:
          typeName = "Litecoin";
          break;
      }
      $(".portfolio-item-container").append(`<div class="portfolio-item">  <div class="CryptoCurrencyType">${typeName}</div> <div class="Percent-of-Portfolio">${portPercent}%</div><div class="CryptoCurrencyVal">${value} ${type}</div><div class="USD">USD $${usdExch}</div></div>`);
    }

    function showTransactions() {
      transactions.forEach(function(data){
        var transText = "";
        var transVal = "";
        var transType;

        wallets.forEach(function(wallet) {
          if (wallet.address == data.from) {
            transText = "Sent ";
            transVal = "-";
          }
        });

        if (transText.length == 0) {
          transText = "Received ";
        }
        switch(data.type) {
          case ETH:
            transText += "Ethereum";
            transType = "ETH";
            break;

          case BTC:
            transText += "Bitcoin";
            transType = "BTC";
            break;

          default:
            transText += "coins";
            transType = "COINS";
            break;
        }

        transVal += data.value;

        populateRecentTransactions(data.date, transText, transVal, transType);
      });
    }

    // blockstack.getFile(STORAGE_FILE, true)
    //           .then((portfolioJson) => {
    //             portfolio = JSON.parse(portfolioJson).results[0];
    //             console.log(portfolio);
    //           });

    //Mock
    portfolio = {
      "wallets": [
        {"type": "eth", "address": "0x4d70715d58fdf75be20bfe9596fc92b54c4a2f13"}
      ]
    };

    wallets = portfolio.wallets;

    if (wallets.length == 0) {
      $(".transaction-container").html('<div class="transaction-common">No Recent Transactions</span>');

    } else {
      var itemsP = 0;
      wallets.forEach(function(wallet) {
        console.log(`address: ${wallet.address}`);
        fetchTransactions(wallet.type, wallet.address);
        $(".portfolio-item-container").append(`<div class="portfolio-item">  <div class="CryptoCurrencyType">${wallet.wallet_name}</div> <div class="Percent-of-Portfolio">59%</div><div class="CryptoCurrencyVal">0.09 BTC</div><div class="USD">USD$760</div></div>`);
      });
      // showTransactions();
    }
  }
});

$(function() {
  var dashboardPage = new DashboardPage();
  dashboardPage.display();
});
