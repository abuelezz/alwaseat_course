'use strict';

angular.module('waterApp')
  .controller('IntroCtrl', function ($scope, $http, $location, globals, navigator) {

    $scope.audio_file = "water_conversation.mp3";
    $scope.goto = function(_to) {
      navigator.go( _to );
    };

    $scope.toggleMute = function() {
      soundManager.getSoundById($scope.audio_file).toggleMute();
    }
    $http.get('data/text_animation_map.json?d=27').success(function(data) {
      $scope.text_animation_map = data;
    });

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


//todo: all of the below should be injected as a services, for now I do not have a time for that is is a POC :)

      var bubble = new Kinetic.Label({
        opacity: 0.75,
        visible: false
      });

      var bubble_text = new Kinetic.Text({
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'black'
      });

      var bubble_tag = new Kinetic.Tag({
        fill: 'white',
        pointerDirection: 'right',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {x:10,y:20},
        shadowOpacity: 0.5
      })

    var showBubbleText = function(label, pTextObject, pX, pY, pText, pVisible) {
      console.log('The value of X:' + pX);
      pVisible = typeof pVisible !== 'undefined' ? pVisible : true;
      label.setX(pX).setY(pY).visible(pVisible);
      pTextObject.setText(pText);

      label.add(bubble_tag);
      label.add(pTextObject);
      layer.add(label);
    }

    imageObj.onload = function() {
      var blob = new Kinetic.Sprite({
        x: 700,
        y: 350,
        height: 264,
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

      if(blob.isRunning()) {
        // play audio
        soundManager.play($scope.audio_file, {

          whileplaying: function() {

            var seconds = parseFloat((this.position/1000)),
                seconds = roundToHalf(seconds),
                x = blob.getX(),
                y = blob.getY() + (blob.getHeight()/2);

            for(var i=0;i< $scope.text_animation_map.length; i++){
              if ($scope.text_animation_map[i].time == seconds) {
                if($scope.text_animation_map[i].visible == true) {
                  blob.animation('talking');
                } else {
                  blob.animation('idle');
                }
                $scope.text_animation_map[i].text = $scope.text_animation_map[i].text.replace("{{userName}}", globals.username);
                showBubbleText(bubble, bubble_text, x, y, $scope.text_animation_map[i].text, $scope.text_animation_map[i].visible);
              }
            }

            soundManager._writeDebug('seconds = ' + seconds);
          }
        });
      }

      document.getElementById('stop').addEventListener('click', function() {
        blob.animation('idle');
        soundManager.pause($scope.audio_file);
      }, false);

      document.getElementById('mouthe').addEventListener('click', function() {
        blob.animation('mouthe');
      }, false);

      document.getElementById('talk').addEventListener('click', function() {
        blob.animation('talking');
        soundManager.resume($scope.audio_file);
      }, false);

      soundManager.whileplaying = function() {
        //soundManager._writeDebug('Peaks, L/R: '+this.peakData.left+'/'+this.peakData.right);
        console.log('Peaks, L/R: '+this.peakData.left+'/'+this.peakData.right);
      }

    };

  function roundToHalf(value) {
    var converted = parseFloat(value); // Make sure we have a number
    var decimal = (converted - parseInt(converted, 10));
    decimal = Math.round(decimal * 10);
    if (decimal == 5) {
      return (parseInt(converted, 10)+0.5);
    }

    if ( (decimal < 3) || (decimal > 7) ) {
      return Math.round(converted);
    }else{
      return (parseInt(converted, 10)+0.5);
    }

  }

    imageObj.src = 'images/drop_charactar_174_264.png';
  });
