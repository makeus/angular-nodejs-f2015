'use strict';

describe('Controls', function() {
  var $compile, $scope, MusicPlayer, Playlist;

  beforeEach(module('musicPlayer:control', function($provide) {
    $provide.value('MusicPlayer', jasmine.createSpyObj('MusicPlayerSpy', ['setSong', 'play', 'stop', 'onPlayChage']));
    $provide.value('Playlist', jasmine.createSpyObj('PlaylistSpy', ['getPrevious', 'setCurrentSong', 'getCurrentSong', 'getNext', 'hasSongs']));
  }));

  beforeEach(inject(function(_$compile_, $rootScope, _MusicPlayer_, _Playlist_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    MusicPlayer = _MusicPlayer_;
    Playlist = _Playlist_;
  }));

  it('on Musicplayer change scope playing should be set based on musicPlayer status', function() {
    MusicPlayer.STATUS_PLAYING = 'playing';
    MusicPlayer.STATUS_STOPPED = 'stopped';

    MusicPlayer.onPlayChage.and.callFake(function(cb) {
      cb(MusicPlayer.STATUS_PLAYING);

      $scope.$apply();

      expect($scope.playing).toBe(true);

      cb(MusicPlayer.STATUS_STOPPED);

      $scope.$apply();

      expect($scope.playing).toBe(false);
    });

    var html = '<controls></controls>';
    var element = $compile(html)($scope);

    $scope.$digest();

    expect(MusicPlayer.onPlayChage).toHaveBeenCalled();
  });

  describe('#play()', function() {
    it('should without songs in playlist should do nothing', function() {
      var html = '<controls><button ng-click="play()"></button></controls>';
      var element = $compile(html)($scope);

      Playlist.hasSongs.and.returnValue(false);

      $scope.$digest();
      element.find('button').click();

      expect(MusicPlayer.play).not.toHaveBeenCalled();
    });

    it('should call Musicplayer play with current song in the Playlist', function() {
      var songId = 2115;
      var html = '<controls><button ng-click="play()"></button></controls>';
      var element = $compile(html)($scope);

      Playlist.hasSongs.and.returnValue(true);
      Playlist.getCurrentSong.and.returnValue(songId);

      $scope.$digest();
      element.find('button').click();

      expect(MusicPlayer.play).toHaveBeenCalled();
      expect(MusicPlayer.setSong).toHaveBeenCalledWith(songId);
      expect(Playlist.getCurrentSong).toHaveBeenCalled();
    });
  });

  describe('#previous()', function() {
    it('should when no previous is gotten from playlist do nothing', function() {
      var html = '<controls><button ng-click="previous()"></button></controls>';
      var element = $compile(html)($scope);

      $scope.$digest();

      element.find('button').click();
      expect(Playlist.getPrevious).toHaveBeenCalled();
      expect(MusicPlayer.play).not.toHaveBeenCalled();
    });

    it('should call Musicplayer play with previous song in the Playlist', function() {
      var songId = 2115;
      var html = '<controls><button ng-click="previous()"></button></controls>';
      var element = $compile(html)($scope);

      Playlist.getPrevious.and.returnValue(songId);

      $scope.$digest();
      element.find('button').click();
      expect(MusicPlayer.play).toHaveBeenCalled();
      expect(MusicPlayer.setSong).toHaveBeenCalledWith(songId);
      expect(Playlist.setCurrentSong).toHaveBeenCalledWith(songId);
    });
  });

  describe('#next()', function() {
    it('should when no next is gotten from playlist do nothing', function() {
        var html = '<controls><button ng-click="next()"></button></controls>';
        var element = $compile(html)($scope);

        $scope.$digest();

        element.find('button').click();
        expect(Playlist.getNext).toHaveBeenCalled();
        expect(MusicPlayer.play).not.toHaveBeenCalled();
    });

    it('should call Musicplayer play with next song in the Playlist', function() {
      var songId = 2115;
      var html = '<controls><button ng-click="next()"></button></controls>';
      var element = $compile(html)($scope);

      Playlist.getNext.and.returnValue(songId);

      $scope.$digest();
      element.find('button').click();

      expect(MusicPlayer.play).toHaveBeenCalled();
      expect(MusicPlayer.setSong).toHaveBeenCalledWith(songId);
      expect(Playlist.setCurrentSong).toHaveBeenCalledWith(songId);
    });
  });
});
