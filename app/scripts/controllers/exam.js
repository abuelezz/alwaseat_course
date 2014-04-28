'use strict';

angular.module('waterApp')
  .controller('ExamCtrl', function ($scope, navigator, $location) {

    $scope.goto = function(_to) {
      navigator.go( _to );
    };

    //$scope.pauseAll = ();
    //soundManager.play('water_conversation.mp3');
    $scope.gotoCertificate = false;

    $scope.loadImages = function(sources, callback) {
      var assetDir = 'images/';
      var images = {};
      var loadedImages = 0;
      var numImages = 0;
      for(var src in sources) {
        numImages++;
      }
      for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
          if(++loadedImages >= numImages) {
            callback(images);
          }
        };
        images[src].src = assetDir + sources[src];
      }
    }

    function isNearOutline(animal, outline) {
      var a = animal;
      var o = outline;
      var ax = a.getX();
      var ay = a.getY();

      if(ax > o.x - 20 && ax < o.x + 20 && ay > o.y - 20 && ay < o.y + 20) {
        return true;
      }
      else {
        return false;
      }
    }

    $scope.initStage = function(images) {
      var stage = new Kinetic.Stage({
        container: 'exam_container',
        width: 1010,
        height: 650
      });

      var stepLayer = new Kinetic.Layer();
      var animalShapes = [];
      var score = 0;

      // image positions
      var steps = {
        eva: {
          x: 140,
          y: 497
        },
        condensation: {
          x: 300,
          y: 493
        },
        precipation: {
          x: 480,
          y: 488
        }
      };

      var outlines = {
        eva_black: {
          x: 720,
          y: 300
        },
        precipation_black: {
          x: 90,
          y: 150
        },
        condensation_black: {
          x: 415,
          y: 135
        }
      };
      // create draggable steps
      for(var key in steps) {

        (function() {
          var privKey = key;
          var anim = steps[key];
          var step = new Kinetic.Image({
            image: images[key],
            x: anim.x,
            y: anim.y,
            draggable: true,
            brightness: 0,
            blurRadius: 0
          });

          step.on('dragstart', function() {
            this.moveToTop();
            stepLayer.draw();
          });
          /*
           * check if step is in the right spot and
           * snap into step if it is
           */
          step.on('dragend', function() {
            var outline = outlines[privKey + '_black'];
            if(!step.inRightPlace && isNearOutline(step, outline)) {
              step.setPosition({x:outline.x, y:outline.y});
              stepLayer.draw();
              step.inRightPlace = true;
              soundManager.play('correct_answer.mp3');
              if(++score >= 3) {
                $scope.gotoCertificate = true;
                $scope.$apply();
              }

              // disable drag and drop
              setTimeout(function() {
                step.setDraggable(false);
              }, 50);
            } else {
              soundManager.play('wrong_answer.wav');
            }
          });
          // make step glow on mouseover
          step.on('mouseover touchstart', function() {
            step.blurRadius(1);
            step.brightness(0.3);
            stepLayer.draw();
            document.body.style.cursor = 'pointer';
          });
          // return step on mouseout
          step.on('mouseout touchend', function() {
            step.blurRadius(0);
            step.brightness(0);
            stepLayer.draw();
            document.body.style.cursor = 'default';
          });

          step.on('dragmove', function() {
            document.body.style.cursor = 'pointer';
          });

          stepLayer.add(step);
          animalShapes.push(step);
        })();
      }

      // create animal outlines
      for(var key in outlines) {
        // anonymous function to induce scope
        (function() {
          console.log(key);
          var imageObj = images[key];
          var out = outlines[key];

          var outline = new Kinetic.Image({
            image: imageObj,
            x: out.x,
            y: out.y
          });

          stepLayer.add(outline);
        })();
      }

      stage.add(stepLayer);
    }


    var sources = {
      eva: 'eva.png',
      eva_black: 'drpElem.png',
      condensation: 'condensation.png',
      condensation_black: 'drpElem.png',
      precipation: 'precipation.png',
      precipation_black: 'drpElem.png',
    };

    $scope.loadImages(sources, $scope.initStage);

  });
