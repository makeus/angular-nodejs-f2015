(function() {
    'use strict';

    angular.module('musicPlayer:container', [])

    .directive('container', ['Navigation', function(Navigation){
      return {
        scope: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.$watch(Navigation.getView, function(view) {
              $scope.view = view;
            });
        }
      };
    }]);
}())
