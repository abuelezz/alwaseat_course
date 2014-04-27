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
        course_title : "Water Course",
        course_images: [
          "backyard.jpg",
          "certificate.png",
          "condensation.png",
          "continue_btn.png",
          "drop_charactar_174_264.png",
          "drpElem.png",
          "exam_bg.png",
          "precipation.png",
          "welcome.png"

          ],
        course_audios: []
    }
);

// Install config settings
app.run(function(globals, $rootScope) {

  $rootScope.course_title = globals.course_title;
  $rootScope.isLoading = true;
  $rootScope.isSuccessful = false;
  $rootScope.percentLoaded = 0;
  $rootScope.totalCount = '?';
  var course_images = globals.course_images;


  // load assets
  // delay each image and append the timestamp to prevent caching
  var log = '',
      baseUrl = 'images/',
      course_images_length = course_images.length,
      loader = new PxLoader();

  for (var i = 0; i < course_images_length; i++) {
      // this time we'll create a PxLoaderImage instance instead of just
      // giving the loader the image url
      var pxImage = new PxLoaderImage(baseUrl + course_images[i]);

      // we can add our own properties for later use
      pxImage.imageNumber = i + 1;

      loader.add(pxImage);
  }


  // callback that runs every time an image loads
  loader.addProgressListener(function(e) {
    console.log(e);
    if ($rootScope.totalCount == '?' ) {
      $rootScope.totalCount = e.totalCount;
    }
    // log which image completed
    console.log(log + 'Image ' + e.resource.getName() + ' Loaded\r');
    $rootScope.percentLoaded = e.completedCount;
    if(e.completedCount == e.totalCount ) {
      $rootScope.isLoading = false;
      $rootScope.isSuccessful = true;
    }
    $rootScope.$apply();
  });

  loader.start();
});
