(function() {
    'use strict';

    angular.module('musicPlayer:navigation', [])

    .service('Navigation', function() {
      var view;
      var viewChangeCbs = [];

      this.setView = function(_view) {
        view = _view;

        _.forEach(viewChangeCbs, function(f) {
          f();
        });
      };

      this.getView = function() {
        return view;
      };

      this.onViewChange = function(cb) {
        viewChangeCbs.push(cb);
      };
    })

    .directive('navigation', ['Navigation', function(Navigation) {
      return {
        scope: true,
        link: function($scope, iElm, iAttrs, controller) {
          $scope.setAlbumView = function() {
            Navigation.setView('album');
            $scope.view = 'album';
          };

          $scope.setUploadView = function() {
            Navigation.setView('upload');
            $scope.view = 'upload';
          };

          $scope.setAlbumView();
        }
      };
    }]);

}());
