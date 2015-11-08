(function() {
    'use strict';

    angular.module('musicPlayer:albumList', [])

    .directive('albumList', [function(){
      return {
        controller: ['$scope', 'AlbumsRemote', function($scope, AlbumsRemote) {
          this.setAlbumOpen = (albumId) => {
            $scope.albumOpen = albumId;
            this.albumOpen = albumId;
          };

          this.albums = AlbumsRemote.query().$promise.then((data) => {
            return data;
          });

          this.getAlbum = (id) => {
            return AlbumsRemote.get({id: id}).$promise.then((data)=> {
              return data;
            });
          }
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
