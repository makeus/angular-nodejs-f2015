describe('CoverService', function() {
  var sinon = require('sinon');
  var assert = require('assert');
  var mockery = require('mockery');

  describe('#uploadCover()', function() {

    var testData = [
      {albumId: 123, testData: { data: 'data', format: 'png' }},
      {albumId: 2, testData: { data: 34535, format: 'jpg' }},
    ];

    testData.forEach((test) => {
     it('should call fs writefile with given picturedata and return url', () => {
        var fs = require('fs');
        var testData = test.testData;
        var albumId = test.albumId;

        sinon.stub(fs, 'writeFile', function(url, data, cb) {
          return cb();
        });

        mockery.enable();

        mockery.registerAllowable('bluebird');
        mockery.registerMock('fs', fs);

        return CoverService.uploadCover(albumId, testData).then(function(url) {
          assert(url);
          assert(fs.writeFile.withArgs(sinon.match(function(url) {
            return url.indexOf(albumId) !== -1 && url.indexOf(testData.format) !== -1;
          }), testData.data).calledOnce);

          mockery.deregisterMock('fs');
          mockery.disable();
          fs.writeFile.restore();
        });
      });
    });

    it('should return a promise rejection with unsupported format', () => {
        var fs = require('fs');
        var testData = {
          data: 'data',
          format: 'fsdgdf'
        };
        var albumId = 123132;

        sinon.spy(fs, 'writeFile');

        mockery.enable();
        mockery.registerAllowable('bluebird');
        mockery.registerMock('fs', fs);

        return CoverService.uploadCover(albumId, testData)
          .catch(function() {
            return require('bluebird').resolve();
          })
          .finally(function() {
            assert(!fs.writeFile.called);

            mockery.deregisterMock('fs');
            mockery.disable();
            fs.writeFile.restore();
          });
    });
  });
});
