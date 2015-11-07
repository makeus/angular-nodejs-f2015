describe('MetadataService', function() {
    var sinon = require('sinon');
    var assert = require('assert');
    var mockery = require('mockery');

    describe('#getMetadataFromFilename()', function() {
      it('should return a promise containing metadata from musicmetadata module', () => {
        var filename = '/asdasd/asd.a';
        var mocStreamData = 'asdasd';
        var testData = {
          album: 'asd',
          year: '1032'
        };

        var fs = require('fs');
        sinon.stub(fs, 'createReadStream', function() {
          return mocStreamData;
        });
        var musicmetadataStub = sinon.stub();

        mockery.enable();
        mockery.registerMock('fs', fs);
        mockery.registerMock('musicmetadata', musicmetadataStub);
        mockery.registerAllowable('bluebird');

        var promise = MetadataService.getMetadataFromFilename(filename).then(function(metadata) {
          assert(fs.createReadStream.withArgs(filename).calledOnce);
          assert(musicmetadataStub.withArgs(mocStreamData).calledOnce);
          assert(metadata === testData);

          mockery.deregisterMock('fs');
          mockery.deregisterMock('musicmetadata');
          mockery.disable();
          fs.createReadStream.restore();
        });

        musicmetadataStub.callArg(1, null, testData);
        return promise;
      });

      it('should return a rejected Promise on fs error', () => {
        var filename = '/asdasd/asd.a';

        var fs = require('fs');
        var fsStub = sinon.stub(fs, 'createReadStream').throws();
        var musicmetadataStub = sinon.stub();

        mockery.enable();
        mockery.registerMock('fs', fs);
        mockery.registerMock('musicmetadata', musicmetadataStub);
        mockery.registerAllowable('bluebird');

       var promise = MetadataService.getMetadataFromFilename(filename)
         .catch(function() {
            return require('bluebird').resolve();
          })
         .finally(function(metadata) {
            assert(fs.createReadStream.withArgs(filename).calledOnce);
            assert(!musicmetadataStub.called);

            mockery.deregisterMock('fs');
            mockery.deregisterMock('musicmetadata');
            mockery.disable();
            fs.createReadStream.restore();
          });
      });
    });
});
