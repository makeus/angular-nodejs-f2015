(function() {
    'use strict';

    angular.module('musicPlayer:album', [])
    .directive('album', ['Playlist', function(Playlist){
      return {
        require: '^albumList',
        link: function($scope, iElm, iAttrs, controller) {
          controller.getAlbum(controller.albumOpen).then(function(album) {
            album.songs = _.sortBy(album.songs, 'trackNumber');
            $scope.album = album;
            Playlist.setSongs(_.map(album.songs, 'id'));
          });
        }
      };
    }])

    .service('Playlist', [function() {
      this.setSongs = function(songs) {
        this.songs = songs;
        this.current = 0;
      };

      this.getCurrentSong = function() {
        return this.songs[this.current];
      };

      this.getNext = function() {
        if(this.songs.length > this.current + 1) {
          return this.songs[this.current + 1];
        }
      };

      this.getPrevious = function() {
        if(this.current > 0) {
          return this.songs[this.current - 1];
        }
      };

      this.setCurrentSong = function(id) {
        this.current = _.indexOf(this.songs, id);
      };
    }]);
}())
