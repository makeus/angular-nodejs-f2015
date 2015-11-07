xdescribe('Song', function() {
  var sinon = require('sinon');
  var assert = require('assert');

  describe('#toJson()', function() {

    it('should leave out fd attirbute', () => {
      var songData = {
        title: 'testTitle',
        artist: 'testARtists',
        fd: '/asd/asd.asd',
        trackNumber: 2,
        album: 2
      };



      var result = Song.toJson();

      assert(resut.fd === undefined);
      assert(result.title === songData.title);
    });
  });

});
