(function() {
    'use strict';

    angular.module('musicPlayer:albumList', [])

    .directive('albumList', [function(){
      return {
        controller: ['$scope', 'AlbumsRemote', 'Navigation', function($scope, AlbumsRemote, Navigation) {

          Navigation.onViewChange(function() {
            this.closeAlbum();
          });

          var $this = this;

          this.setAlbumOpen = function(albumId) {
            $scope.albumOpen = albumId;
            $this.albumOpen = albumId;
          };

          this.closeAlbum = function() {
            $scope.albumOpen = false;
          };

          this.albums = AlbumsRemote.query().$promise.then(function(data) {
            return data;
          });

          this.getAlbum = function(id) {
            return AlbumsRemote.get({id: id}).$promise.then(function(data) {
              return data;
            });
          };
        }],
        link: function($scope, iElm, iAttrs, controller) {
          controller.albums.then(function(data) {
            $scope.albums = data;
          });
          $scope.openAlbum = controller.setAlbumOpen;
        }
      };
    }]);
}());
