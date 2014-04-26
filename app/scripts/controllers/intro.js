'use strict';

angular.module('waterApp')
  .controller('IntroCtrl', function ($scope, $location, globals, navigator) {

    $scope.goto = function(_to) {
      navigator.go( _to );
    };


    // Draw and Animation
    var stage = new Kinetic.Stage({
      container: 'backyard_container',
      width: 1010,
      height: 650
    });

    var layer = new Kinetic.Layer();
    var imageObj = new Image();
    imageObj.onerror = function(e) {
        console.log(e);
    };

    imageObj.onload = function() {
      var blob = new Kinetic.Sprite({
        x: 700,
        y: 350,
        image: imageObj,
        animation: 'talking',
        draggable: true,
        animations: {
          idle: [
            // x, y, width, height (4 frames)
            0,0,174,264
          ],
          mouthe: [
            // x, y, width, height (4 frames)
            522,0,174,264
          ],
          talking: [
            // x, y, width, height (3 frames)
            0,0,174,264,
            174,0,174,264,
            348,0,174,264,
            522,0,174,264,
            696,0,174,264,
            870,0,174,264
          ]
        },
        frameRate: 8,
        frameIndex: 0
      });

      // add the shape to the layer
      layer.add(blob);
      // add the layer to the stage
      stage.add(layer);
      // start sprite animation
      blob.start();

      document.getElementById('stop').addEventListener('click', function() {
        blob.animation('idle');
      }, false);

      document.getElementById('mouthe').addEventListener('click', function() {
        blob.animation('mouthe');
      }, false);

      document.getElementById('talk').addEventListener('click', function() {
        blob.animation('talking');
      }, false);

    };

    imageObj.src = 'images/drop_charactar_174_264.png';
  });
