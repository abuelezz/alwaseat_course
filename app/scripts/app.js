'use strict';

var app = angular
  .module('waterApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeCtrl'
      })
      .when('/intro', {
        templateUrl: 'views/intro.html',
        controller: 'IntroCtrl'
      })
      .when('/certificate', {
        templateUrl: 'views/certificate.html',
        controller: 'CertificateCtrl'
      })
      .when('/exam', {
        templateUrl: 'views/exam.html',
        controller: 'ExamCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

// Shared content service
app.service('SharedContent', function(){
  var user = {};
  return {
    setUserName: function(value) {
      user.userName = value;
    },
    getUserName: function() {
      return user.userName;
    }
  }
});

app.service('navigator', ['$location', function($location){
  return {
    go: function(_to) {
      $location.path(_to);
    }
  }
}]);

// Define global variables
app.value('globals', {
        course_title : "Water Course"
    }
);

// Install config settings
app.run(function(globals, $rootScope) {
  console.log('Start to load global setting', globals.course_title);
  $rootScope.course_title = globals.course_title;
});
