'use strict';

angular.module('waterApp')
  .controller('CertificateCtrl', function ($scope, globals) {
    $scope.username = globals.username;
  });
