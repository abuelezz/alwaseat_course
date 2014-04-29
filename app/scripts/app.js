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
        templateUrl: 'views/intro.html?d=1',
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

app.service('SM2', [function(){
  this.test = function() {
    console.log('>>>>>>>>>>>>>>>>>> SM2 Test');
  }
}])
app.service('navigator', ['$location', function($location){
  return {
    go: function(_to) {
      soundManager.stopAll();
      $location.path(_to);
    }
  }
}]);

// Define global variables
app.value('globals', {
        course_title : "Water Course",
        images_base_path: "images/",
        audio_base_path: "audio/",
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
        course_audios: [
          "correct_answer.mp3",
          "water_conversation.mp3",
          "wrong_answer.wav"
          ]
    }
);

// Install config settings
app.run(function(globals, $rootScope, navigator, $templateCache) {

  $rootScope.$on('$viewContentLoaded', function() {
    $templateCache.removeAll();
  });

  // if there is no username entered move user to the welcome page
  if(globals.userName == undefined) {
    navigator.go('/');
  }

  $rootScope.course_title = globals.course_title;
  $rootScope.isLoading = true;
  $rootScope.isSuccessful = false;
  $rootScope.percentLoaded = 0;
  $rootScope.totalCount = '?';
  var course_images = globals.course_images,
      course_images_length = course_images.length,
      course_audios = globals.course_audios,
      course_audios_length = course_audios.length,
      images_base_path = globals.images_base_path,
      audio_base_path = globals.audio_base_path;


  // load assets images
  // delay each image and append the timestamp to prevent caching
  var log = '',
      loader = new PxLoader();


  // load images
  for (var i = 0; i < course_images_length; i++) {
      // this time we'll create a PxLoaderImage instance instead of just
      // giving the loader the image url
      var pxImage = new PxLoaderImage(images_base_path + course_images[i]);

      // we can add our own properties for later use
      pxImage.imageNumber = i + 1;

      loader.add(pxImage);
  }

  // load audios

  // initialize the sound manager

  soundManager.setup({
    url: 'soundmanager2/swf/',
    preferFlash: false,
    useHTML5Audio: true
  });

  for (var i = 0; i < course_audios_length; i++) {
      var audio_url = audio_base_path + course_audios[i];

      soundManager.createSound({
        id: course_audios[i],
        url: audio_url
      });
  }


  // callback that runs every time an image loads
  loader.addProgressListener(function(e) {

    if ($rootScope.totalCount == '?' ) {
      $rootScope.totalCount = e.totalCount;
    }

    $rootScope.percentLoaded = e.completedCount;
    if(e.completedCount == e.totalCount ) {
      $rootScope.isLoading = false;
      $rootScope.isSuccessful = true;
    }
    $rootScope.$apply();
  });

  loader.start();

  // load audio files
});
