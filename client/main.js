var Backbone = require('backbone');
var blockstack = require('blockstack');

var AppView = Backbone.View.extend({
  render: function(){
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

$(function() {
  var appView = new AppView();
  appView.render();
});