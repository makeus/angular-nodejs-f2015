(function() {
    'use strict';
    angular.module('musicPlayer:upload', ['ngFileUpload'])

    .directive('uploadBar', [function(){
      return {
        scope: true,
        template: function() {
          return [
              '<div class="row" ng-if="!complete">',
              '<small class="col-xs-8 text-left">{{name}}</small>',
              '<small class="col-xs-4 text-right">{{size}}</small>',
              '<progress value="{{loaded}}", max="{{total}}" class="progress col-xs-12 progress-striped">{{loaded}}</progress>',
              '</div>',
              '<div class="row" ng-if="complete">',
              '<span class="col-xs-10 text-left"><i class="fa fa-download"></i> {{name}} <small>{{size}}</small></span>',
              '<span class="col-xs-2 text-right dowloaded"><i class="fa fa-check-circle"></i></span>',
              '</div>',
            ].join('');
        },
        link: function($scope, iElm, iAttrs, controller) {
          $scope.loaded = 0;
          $scope.total = 100;
          $scope.name = iAttrs.name;
          $scope.size = (iAttrs.size / 1000000).toFixed(2) + 'mb';
          var promise = $scope.$eval(iAttrs.promise)
          .then(function (resp) {
              $scope.complete = true;
            }, function (resp) {
              $scope.failure = true;
            }, function (evt) {
              $scope.loaded = evt.loaded;
              $scope.total = evt.total;
            });
        }
      };
    }])

    .directive('upload', ['Upload', '$compile', function(Upload, $compile){
      return {
        link: function($scope, iElm, iAttrs, controller) {
          $scope.uploadFiles = function (files) {
            if (files && files.length) {
              _.forEach(files, function(file) {
                $scope.promise = Upload.upload({
                  url: 'api/songs/',
                  objectKey: '.k',
                  data: {song: file}
                });
                iElm.prepend($compile('<upload-bar name="' + file.name  + '" size="' + file.size + '" promise="promise"></upload-bar>')($scope));
              });
            }
          }
        }
      };
    }]);
}())
