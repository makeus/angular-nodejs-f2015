(function() {
    'use strict';

    angular.module('musicPlayer:song', [])

    .directive('song', ['MusicPlayer', 'Playlist', function(MusicPlayer, Playlist){
      return {
        scope: true,
        link: function($scope, iElm, iAttrs, controller) {
          var id = parseInt(iAttrs.songId);
          iElm.click(function() {
            if(iElm.hasClass('playing')) {
              MusicPlayer.stop();
            } else {
              MusicPlayer.setSong(id);
              MusicPlayer.play();
              Playlist.setCurrentSong(id);
            }
          });

          $scope.playing = false;

          MusicPlayer.onPlayChage(function(status, song) {
            switch(status) {
              case MusicPlayer.STATUS_PLAYING: {
                if(song === id) {
                  iElm.addClass('playing');
                  $scope.playing = true;
                }
                break;
              }
              case MusicPlayer.STATUS_STOPPED: {
                if(song === id) {
                  iElm.removeClass('playing');
                  $scope.playing = false;
                }
                break;
              }
            }
          });
        }
      };
    }])

    .directive('seekBar', ['MusicPlayer', '$interval', function(MusicPlayer, $interval){
      return {
        link: function($scope, iElm, iAttrs, controller) {
          var promise = $interval(function(){
            $scope.currentTime = MusicPlayer.getCurrentPlaytime();
            $scope.total = MusicPlayer.getTotalDuration();
          }, 100);

          $scope.$on('$destroy', function() {
            $interval.cancel(promise);
          });
        }
      };
    }])

    .filter('secondToTime', [function() {
      return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
      };
    }]);
}())
