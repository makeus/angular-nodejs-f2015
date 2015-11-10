'use strict';

describe('Playlist', function() {
    var Playlist;
    beforeEach(module('musicPlayer:album'));
    beforeEach(inject(function(_Playlist_) {
      Playlist = _Playlist_;
    }));

    describe('#setSongs()', function() {
      it('should set songs field and set current to zeo', function() {
        var songs = [1,4,64];
        Playlist.setSongs(songs);

        expect(Playlist.current).toBe(0);
        expect(Playlist.songs).toEqual(jasmine.arrayContaining(songs));
      });
    });

    describe('#getCurrentSong()', function() {
      it('should return song in index of current', function() {
        var songs = [1,4,64];
        Playlist.setSongs(songs);

        expect(Playlist.getCurrentSong()).toEqual(Playlist.songs[Playlist.current]);
      });
    });

    describe('#getNext()', function() {
      it('should return next index of song unless there is none', function() {
        var songs = [1,4,64];
        Playlist.setSongs(songs);

        expect(Playlist.getNext()).toEqual(Playlist.songs[Playlist.current + 1]);

        Playlist.current = 1;

        expect(Playlist.getNext()).toEqual(Playlist.songs[Playlist.current + 1]);

        Playlist.current = 2;

        expect(Playlist.getNext()).toEqual(undefined);

        Playlist.current = 4;

        expect(Playlist.getNext()).toEqual(undefined);
      });
    });

    describe('#getPrevious()', function() {
      it('should return previous index of song unless there is none', function() {
        var songs = [1,4,64];
        Playlist.setSongs(songs);

        expect(Playlist.getPrevious()).toEqual(undefined);

        Playlist.current = 1;

        expect(Playlist.getPrevious()).toEqual(Playlist.songs[Playlist.current - 1]);

        Playlist.current = 2;

        expect(Playlist.getPrevious()).toEqual(Playlist.songs[Playlist.current - 1]);
      });
    });

    describe('#setCurrentSong()', function() {
      it('should set the index of given songId if found', function() {
        var songs = [1,4,64];
        Playlist.setSongs(songs);

        Playlist.setCurrentSong(64);
        expect(Playlist.getCurrentSong()).toEqual(64);
        Playlist.setCurrentSong(4);
        expect(Playlist.getCurrentSong()).toEqual(4);
        Playlist.setCurrentSong(15);
        expect(Playlist.getCurrentSong()).toEqual(4);
      });
    });
});
