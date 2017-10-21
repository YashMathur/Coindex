var Backbone = require('backbone');
var blockstack = require('blockstack');
// const Gdax = require('gdax');

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

// var Graph = Backbone.View.extend({
//   render: function(){
//     const websocket = new Gdax.WebsocketClient(['BTC-USD', 'ETH-USD']);
//     websocket.on('message', data => {
//       console.log(data);
//     });
//     websocket.on('error', err => {
//       console.log(err);
//     });
//     websocket.on('close', () => {
//       console.log('closed');
//     });
//   }
// });

$(function() {
  var loginPage = new LoginPage();
  loginPage.login();
  // var graph = new Graph();
  // graph.render();
});
