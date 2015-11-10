'use strict';

describe('MusicPlayer', function() {
    var MusicPlayer, audioMock;

    beforeEach(module('musicPlayer:player'));

    beforeEach(inject(function(_MusicPlayer_, $window) {
      MusicPlayer = _MusicPlayer_;

      audioMock = jasmine.createSpyObj('AudioSpy', ['play', 'pause']);
      spyOn(window, 'Audio').and.returnValue(audioMock);
    }));

    describe('#setSong()', function() {
      it('should on first time create a new Audio', function() {
        var songId = 123;

        MusicPlayer.setSong(songId);

        expect(window.Audio).toHaveBeenCalledWith(jasmine.stringMatching(songId + ''));
      });

      it('should on second time only set audio src', function() {
        var songId = 123;
        var songId2 = 545;

        MusicPlayer.setSong(songId);

        expect(window.Audio).toHaveBeenCalledWith(jasmine.stringMatching(songId + ''));

        window.Audio.calls.reset();

        MusicPlayer.setSong(songId2);

        expect(window.Audio).not.toHaveBeenCalled();
        expect(audioMock.src).toEqual(jasmine.stringMatching(songId2 + ''));
      });
    });

    describe('#getCurrentSong()', function() {
      it('should return undefined if not set', function() {
        expect(MusicPlayer.getCurrentSong()).toEqual(undefined);
      });

      it('should return songId', function() {
        var songId = 123;

        MusicPlayer.setSong(songId);

        expect(MusicPlayer.getCurrentSong()).toEqual(songId);
      });
    });

    describe('#getCurrentPlaytime()', function() {
      it('should return undefined if not set', function() {
        expect(MusicPlayer.getCurrentPlaytime()).toEqual(undefined);
      });

      it('should return from audio object', function() {
        var time = 12315;
        audioMock.currentTime = time;

        var songId = 123;

        MusicPlayer.setSong(songId);
        expect(MusicPlayer.getCurrentPlaytime()).toEqual(time);
      });
    });

    describe('#getTotalDuration()', function() {
      it('should return undefined if not set', function() {
        expect(MusicPlayer.getTotalDuration()).toEqual(undefined);
      });

      it('should return from audio object', function() {
        var time = 12315;
        audioMock.duration = time;

        var songId = 123;

        MusicPlayer.setSong(songId);
        expect(MusicPlayer.getTotalDuration()).toEqual(time);
      });
    });

    describe('#play()', function() {
      it('should do nothing if not defined', function() {
        MusicPlayer.play();
      });

      it('should call audio object play', function() {
        var songId = 123;

        MusicPlayer.setSong(songId);
        MusicPlayer.play();
        expect(audioMock.play).toHaveBeenCalled();
      });
    });

    describe('#stop()', function() {
      it('should do nothing if not defined', function() {
        MusicPlayer.stop();
      });

      it('should call audio object pause', function() {
        var songId = 123;

        MusicPlayer.setSong(songId);
        MusicPlayer.stop();
        expect(audioMock.pause).toHaveBeenCalled();
      });
    });

    describe('#getStatus()', function() {
      it('should default to STATUS_STOPPED', function() {
        expect(MusicPlayer.getStatus()).toEqual(MusicPlayer.STATUS_STOPPED);
      });

      it('should on play set the status to STATUS_PLAYING', function() {
        var songId = 123;

        MusicPlayer.setSong(songId);
        MusicPlayer.play();
        expect(MusicPlayer.getStatus()).toEqual(MusicPlayer.STATUS_PLAYING);
      });

      it('should on stop set the status to STATUS_STOPPED', function() {
        var songId = 123;
        MusicPlayer.setSong(songId);
        MusicPlayer.play();
        MusicPlayer.stop();

        expect(MusicPlayer.getStatus()).toEqual(MusicPlayer.STATUS_STOPPED);
      });
    });

    describe('#onPlayChage()', function() {
      it('should set callback to be called when play or stop is called', function() {
        var songId = 123;
        MusicPlayer.setSong(songId);

        var spy1 = jasmine.createSpy();

        MusicPlayer.onPlayChage(spy1);
        expect(spy1).not.toHaveBeenCalled();

        MusicPlayer.play();
        expect(spy1).toHaveBeenCalled();

        MusicPlayer.stop();
        expect(spy1).toHaveBeenCalled();

        var spy2 = jasmine.createSpy();
        MusicPlayer.onPlayChage(spy2);

        MusicPlayer.play();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

        MusicPlayer.stop();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
      });
    })
});
