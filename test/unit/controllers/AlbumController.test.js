describe('AlbumController',function() {
  var sinon = require('sinon');
  var assert = require('assert');
  var mock = require('sails-mock-models');

  describe('#create()', function() {
    it('should call badRequest', () => {
      var req = {};
      var res = {
        badRequest: sinon.spy()
      };

      var AlbumController = require(sails.config.appPath + '/api/controllers/AlbumController');
      AlbumController.create(req, res);
      assert(res.badRequest.calledOnce);
    });
  });
});

