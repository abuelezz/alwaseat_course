'use strict';

angular.module('waterApp')
  .controller('WelcomeCtrl', function ($scope, $location, globals) {
    $scope.getUser = function (username) {
      if(username == undefined) {
        alert('Please enter your name');
      } else {
        // go to the next page
        globals.username = username;
        $location.path( "/intro" );
      }
    }
  });
