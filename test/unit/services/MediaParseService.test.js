describe('MediaParseService', function() {

  var sinon = require('sinon');
  var assert = require('assert');
  var mockery = require('mockery');
  var Promise = require('bluebird');

   describe('#parseDirectoryMedias()', function() {
      it('should get filenames from fs and call parseMedia with each file returning a promise', () => {
        var filenames = ['/asd/', 'gfd/sds.dsf'];
        var directory = '/asdasd';

        var fs = require('fs');
        sinon.stub(fs, 'readdir', function(dir, cb) {
          cb(null, filenames);
        });

        sinon.stub(MediaParseService, 'parseMediaFile', Promise.resolve);

        mockery.enable();
        mockery.registerMock('fs', fs);
        mockery.registerAllowable('bluebird');
        mockery.registerAllowable('path');

        return MediaParseService.parseDirectoryMedias(directory).then(function() {
          assert(fs.readdir.withArgs(directory).calledOnce);
          assert(MediaParseService.parseMediaFile.calledTwice);

          mockery.deregisterMock('fs');
          mockery.disable();
          fs.readdir.restore();
          MediaParseService.parseMediaFile.restore();
        });
      });

      it('should return a rejection if one of the MediaParses fail', () => {
        var filenames = ['/asd/', 'gfd/sds.dsf'];
        var directory = '/asdasd';

        var fs = require('fs');
        sinon.stub(fs, 'readdir', function(dir, cb) {
          cb(null, filenames);
        });

        var parseStub = sinon.stub(MediaParseService, 'parseMediaFile');
        parseStub.onCall(0).returns(Promise.resolve());
        parseStub.onCall(1).throws();

        mockery.enable();
        mockery.registerMock('fs', fs);
        mockery.registerAllowable('bluebird');
        mockery.registerAllowable('path');

        return MediaParseService.parseDirectoryMedias(directory)
         .catch(function() {
          return require('bluebird').resolve();
        })
        .finally(function() {
          assert(fs.readdir.withArgs(directory).calledOnce);
          assert(MediaParseService.parseMediaFile.calledTwice);

          mockery.deregisterMock('fs');
          mockery.disable();
          fs.readdir.restore();
          MediaParseService.parseMediaFile.restore();
        });
      });
   });

  describe('#parseMediaFile()', function() {
     var testMetadata = {
        album: 'testAlbum',
        year: '2312',
        artist: 'testArtist',
        track: {
          no: 12
        },
        title: 'testTitle',
        genre: ['testGenre1', 'testGenre2'],
        picture: [{
          data: 'pictureData',
          format: 'png'
        }]
      };

      var testAlbum = {
        id: 123,
        name: 'testAlbum',
        year: '2312',
        genre: 'testGenre1'
      };

      var testSong = {
        artist: 'testArtist',
        title: 'testTitle',
        track: 12
      };

    it('should parse mediafile and  create new entries of songs and albums if no previous ones area found', () => {
        var testCoverUrl = '/asd/asd';
        var testFilePAth = '/asd/asdsa/dsa.fdg';
        var mock = require('sails-mock-models');
        mock.mockModel(Album, 'findOneByName', null);
        mock.mockModel(Album, 'create', testAlbum);
        mock.mockModel(Album, 'update', testAlbum);
        mock.mockModel(Song, 'findOne', null);
        mock.mockModel(Song, 'create', testSong);

        sinon.stub(MetadataService, 'getMetadataFromFilename', function() {
          return Promise.resolve(testMetadata);
        });

        sinon.stub(CoverService, 'uploadCover', function() {
          return Promise.resolve(testCoverUrl);
        });

        return MediaParseService.parseMediaFile(testFilePAth).then(function(song) {
          assert(MetadataService.getMetadataFromFilename.withArgs(testFilePAth).calledOnce);
          assert(Album.findOneByName.withArgs(testMetadata.album).calledOnce);
          assert(Album.create.withArgs(sinon.match.has('name', testMetadata.album).calledOnce));
          assert(CoverService.uploadCover.withArgs(testAlbum.id, testMetadata.picture[0]).calledOnce);
          assert(Album.update.withArgs(sinon.match.object, sinon.match.has('cover', testCoverUrl)));
          assert(Song.findOne.calledOnce);
          assert(Song.create.withArgs(sinon.match({
            title: sinon.match.string,
            artist: sinon.match.string,
            album: testAlbum.id
          })));
          assert(song === testSong);

          MetadataService.getMetadataFromFilename.restore();
          CoverService.uploadCover.restore();
          Album.findOneByName.restore();
          Album.create.restore();
          Album.update.restore();
          Song.findOne.restore();
          Song.create.restore();
        });
    });

    it('should parse mediafile and  create new entries of songs and albums if no previous ones area found even when some of the data is incomplete', () => {
        var testCoverUrl = '/asd/asd';
        var testFilePAth = '/asd/asdsa/dsa.fdg';
        var mock = require('sails-mock-models');
        mock.mockModel(Album, 'findOneByName', null);
        mock.mockModel(Album, 'create', testAlbum);
        mock.mockModel(Album, 'update', testAlbum);
        mock.mockModel(Song, 'findOne', null);
        mock.mockModel(Song, 'create', testSong);

        testMetadata.genre = [];

        sinon.stub(MetadataService, 'getMetadataFromFilename', function() {
          return Promise.resolve(testMetadata);
        });

        sinon.stub(CoverService, 'uploadCover', function() {
          return Promise.resolve(testCoverUrl);
        });

        return MediaParseService.parseMediaFile(testFilePAth).then(function(song) {
          assert(MetadataService.getMetadataFromFilename.withArgs(testFilePAth).calledOnce);
          assert(Album.findOneByName.withArgs(testMetadata.album).calledOnce);
          assert(Album.create.withArgs(sinon.match.has('name', testMetadata.album).calledOnce));
          assert(CoverService.uploadCover.withArgs(testAlbum.id, testMetadata.picture[0]).calledOnce);
          assert(Album.update.withArgs(sinon.match.object, sinon.match.has('cover', testCoverUrl)));
          assert(Song.findOne.calledOnce);
          assert(Song.create.withArgs(sinon.match({
            title: sinon.match.string,
            artist: sinon.match.string,
            album: testAlbum.id
          })));
          assert(song === testSong);

          MetadataService.getMetadataFromFilename.restore();
          CoverService.uploadCover.restore();
          Album.findOneByName.restore();
          Album.create.restore();
          Album.update.restore();
          Song.findOne.restore();
          Song.create.restore();
        });
    });

    it('should parse mediafile and not create new entries if previous ones area found', () => {
        var testCoverUrl = '/asd/asd';
        var testFilePAth = '/asd/asdsa/dsa.fdg';
        var mock = require('sails-mock-models');
        mock.mockModel(Album, 'findOneByName', testAlbum);
        mock.mockModel(Album, 'create', null);
        mock.mockModel(Album, 'update', null);
        mock.mockModel(Song, 'findOne', testSong);
        mock.mockModel(Song, 'create', null);

        sinon.stub(MetadataService, 'getMetadataFromFilename', function() {
          return Promise.resolve(testMetadata);
        });

        sinon.stub(CoverService, 'uploadCover', function() {
          return Promise.resolve(testCoverUrl);
        });

        return MediaParseService.parseMediaFile(testFilePAth).then(function(song) {
          assert(!MetadataService.getMetadataFromFilename.called);
          assert(!Album.findOneByName.called);
          assert(!Album.create.called);
          assert(!CoverService.uploadCover.called);
          assert(!Album.called);
          assert(Song.findOne.calledOnce);
          assert(!Song.create.called);
          assert(song === testSong);

          MetadataService.getMetadataFromFilename.restore();
          CoverService.uploadCover.restore();
          Album.findOneByName.restore();
          Album.create.restore();
          Album.update.restore();
          Song.findOne.restore();
          Song.create.restore();
        });
    });

    it('should parsemedia file and create song entires but not update album with cover data if no cover is found from metadata', () => {
        var testCoverUrl = '/asd/asd';
        var testFilePAth = '/asd/asdsa/dsa.fdg';
        var mock = require('sails-mock-models');
        mock.mockModel(Album, 'findOneByName', testAlbum);
        mock.mockModel(Album, 'create', null);
        mock.mockModel(Album, 'update', null);
        mock.mockModel(Song, 'findOne', null);
        mock.mockModel(Song, 'create', testSong);

        testMetadata.picture = [];

        sinon.stub(MetadataService, 'getMetadataFromFilename', function() {
          return Promise.resolve(testMetadata);
        });

        sinon.stub(CoverService, 'uploadCover', function() {
          return Promise.resolve(testCoverUrl);
        });

        return MediaParseService.parseMediaFile(testFilePAth).then(function(song) {
          assert(MetadataService.getMetadataFromFilename.withArgs(testFilePAth).calledOnce);
          assert(Album.findOneByName.withArgs(testMetadata.album).calledOnce);
          assert(!Album.create.called);
          assert(!CoverService.uploadCover.called);
          assert(Album.update.withArgs(sinon.match.object, sinon.match.has('cover', testCoverUrl)));
          assert(Song.findOne.calledOnce);
          assert(Song.create.withArgs(sinon.match({
            title: sinon.match.string,
            artist: sinon.match.string,
            album: testAlbum.id
          })));
          assert(song === testSong);

          MetadataService.getMetadataFromFilename.restore();
          CoverService.uploadCover.restore();
          Album.findOneByName.restore();
          Album.create.restore();
          Album.update.restore();
          Song.findOne.restore();
          Song.create.restore();
        });
    });
  });
});
