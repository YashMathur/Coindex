var Backbone = require('backbone');
var blockstack = require('blockstack');

var STORAGE_FILE = 'coindex.json';

var LoginPage = Backbone.View.extend({
  login: function(){
    $('main').click(function() {
      console.log('<h1>Browserify is mathematical.</h1>');
    });

    $('#signin-button').click(function(event) {
      event.preventDefault();
      blockstack.redirectToSignIn();
    });

    $('#signout-button').click(function(event) {
      event.preventDefault();
      blockstack.signUserOut(window.location.href);
    });

    function showProfile(profile) {
      var person = new blockstack.Person(profile)
      $('#heading-name').text(person.name() ? person.name() : "Nameless Person");
      if(person.avatarUrl()) {
        $('#avatar-image').attr('src', person.avatarUrl());
      }
      $('#section-1').style('display', 'none');
      $('#section-2').style('display', 'block');
    }

    if (blockstack.isUserSignedIn()) {
      var profile = blockstack.loadUserData().profile;
      showProfile(profile);
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function(userData) {
        window.location = window.location.origin;
      })
    }
  }
});

var DashboardPage = Backbone.View.extend({
  display: function(){
    var portfolio;
    var wallets;
    var transactions;

    function fetchTransactions(type, address) {

    }

    blockstack.getFile(STORAGE_FILE, true)
              .then((portfolioJson) => {
                portfolio = JSON.parse(portfolioJson).results[0];
                console.log(portfolio);
              });

    wallets = portfolio.wallets;
    if (wallets.length == 0) {
      $(".transaction-container").html('<span>No Recent Transactions</span>');
    } else {
      wallets.forEach(function(type, address) {
        console.log(address);
        transactions.push(fetchTransactions(type, address));
        
      });
    }
  }
});

$(function() {
  var loginPage = new LoginPage();
  loginPage.login();

  var dashboardPage = new DashboardPage();
  dashboardPage.display();
});


