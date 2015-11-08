(function() {
    'use strict';

    angular.module('musicPlayer:control', [])

    .directive('controls', ['MusicPlayer', 'Playlist', function(MusicPlayer, Playlist){
      return {
        link: function($scope, iElm, iAttrs, controller) {
          MusicPlayer.onPlayChage(function(status) {
            switch(status) {
              case MusicPlayer.STATUS_PLAYING: {
                $scope.$applyAsync(function() {
                  $scope.playing = true;
                });
                break;
              }
              case MusicPlayer.STATUS_STOPPED: {
                $scope.$applyAsync(function() {
                  $scope.playing = false;
                });
                break;
              }
            }
          });

          $scope.stop = MusicPlayer.stop;
          $scope.play = function() {
            MusicPlayer.setSong(Playlist.getCurrentSong());
            MusicPlayer.play();
          };
        }
      };
    }]);
}());
