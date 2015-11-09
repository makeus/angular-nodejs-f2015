(function() {
    'use strict';

    angular.module('musicPlayer:albumList', [])

    .directive('albumList', [function(){
      return {
        controller: ['$scope', 'AlbumsRemote', 'Navigation', function($scope, AlbumsRemote, Navigation) {

          Navigation.onViewChange(() => {
            this.closeAlbum();
          });

          this.setAlbumOpen = (albumId) => {
            $scope.albumOpen = albumId;
            this.albumOpen = albumId;
          };

          this.closeAlbum = () => {
            $scope.albumOpen = false;
          };

          this.albums = AlbumsRemote.query().$promise.then((data) => {
            return data;
          });

          this.getAlbum = (id) => {
            return AlbumsRemote.get({id: id}).$promise.then((data)=> {
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
}())
