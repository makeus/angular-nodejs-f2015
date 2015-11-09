(function() {
    'use strict';

    angular.module('musicPlayer:player', [])

    .service('MusicPlayer', ['$q', function($q){
      var audio, song, status;
      var playChangeCallbacks = [];

      this.STATUS_PLAYING = 'playing';
      this.STATUS_STOPPED = 'stopped';

      this.getStatus = function() {
        return status;
      };

      var $this = this;
      this.play = function() {
        _.forEach(playChangeCallbacks, function(cb) {
          cb($this.STATUS_PLAYING, song)
        });
        status = $this.STATUS_PLAYING;
        audio.play();
      };

      this.stop = function() {
        _.forEach(playChangeCallbacks, function(cb) {
          cb($this.STATUS_STOPPED, song)
        });
        status = $this.STATUS_STOPPED;
        audio.pause();
      };

      this.setSong = function(_song) {
        if(!audio) {
          audio = new Audio('/api/songs/' + _song);
          song = _song;
          return;
        }
        this.stop();
        audio.src = '/api/songs/' + _song;
        song = _song;
      };

      this.onPlayChage = function(cb) {
        playChangeCallbacks.push(cb);
      };

      this.getTotalDuration = function() {
        if(audio) {
          return audio.duration;
        }
      };

      this.getCurrentPlaytime = function() {
        if(audio) {
          return audio.currentTime;
        }
      };

      this.getCurrentSong = function() {
        return song;
      };

    }]);
}());
