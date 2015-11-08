(function() {
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
    }])

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
        this.current = _.indexOf(songs, id);
      };
    }])

    .directive('song', ['MusicPlayer', 'Playlist', function(MusicPlayer, Playlist){
      return {
        link: function($scope, iElm, iAttrs, controller) {
          iElm.click(function() {
            if(iElm.hasClass('playing')) {
              MusicPlayer.stop();
            } else {
              MusicPlayer.setSong(iAttrs.songId);
              MusicPlayer.play();
              Playlist.setCurrentSong(iAttrs.songId);
            }
          });

          MusicPlayer.onPlayChage(function(status, song) {
            switch(status) {
              case MusicPlayer.STATUS_PLAYING: {
                if(song === iAttrs.songId) {
                  elem.addClass('playing');
                }
                break;
              }
              case MusicPlayer.STATUS_STOPPED: {
                if(song === iAttrs.songId) {
                  elem.removeClass('playing');
                }
                break;
              }
            }
          });
        }
      };
    }]);
}())
