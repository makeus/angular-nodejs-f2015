(function() {
    'use strict';

    angular.module('musicPlayer', [
      'musicPlayer:album',
      'musicPlayer:navigation',
      'musicPlayer:remote',
      'musicPlayer:albumList',
      'musicPlayer:player',
      'musicPlayer:control',
      'musicPlayer:container',
      'musicPlayer:song'
      ]);

}());
