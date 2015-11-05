describe('AlbumController',function() {
  var sinon = require('sinon');
  var assert = require('assert');
  var AlbumController;

  beforeEach(function() {
    AlbumController = require(sails.config.appPath + '/api/controllers/AlbumController');
  });

describe('#find()', function() {
    it('should call Album find with given parameters', (done) => {
      var paramData = {
        limit: 10
      };
      var req = {
        allParams: sinon.stub().returns(paramData)
      };
      var res = {
        ok: sinon.stub()
      };

      var mockAlbum = {
        name: 'ads'
      };

      var mock = require('sails-mock-models');
      mock.mockModel(Album, 'find', mockAlbum);

      AlbumController.find(req, res).then(function() {
        assert(res.ok.calledWith(mockAlbum));
        assert(req.allParams.calledOnce);
        Album.find.restore();
        done();
      });
    });

    it('should call res serverError on error', (done) => {
      var paramData = {
        limit: 10
      };
      var req = {
        allParams: sinon.stub().returns(paramData)
      };

      var res = {
        serverError: sinon.stub(),
        ok: sinon.stub()
      };

      var mock = require('sails-mock-models');
      mock.mockModel(Album, 'find', null, new Error('error'));

      AlbumController.find(req, res).then(function() {
        assert(res.serverError.calledOnce);
        assert(!res.ok.called);
        assert(req.allParams.calledOnce);
        Album.find.restore();
        done();
      });
    });
  });

  describe('#findOne()', function() {
    it('should call Album findOne with given id', (done) => {
      var id = 15;
      var req = {
        param: sinon.stub().returns(id)
      };
      var res = {
        ok: sinon.stub()
      };

      var mockAlbum = {
        name: 'ads'
      };

      var mock = require('sails-mock-models');
      mock.mockModel(Album, 'findOne', mockAlbum);

      AlbumController.findOne(req, res).then(function() {
        assert(res.ok.calledWith(mockAlbum));
        assert(req.param.calledWith('id'));
        Album.findOne.restore();
        done();
      });
    });

    it('should call res serverError on error', (done) => {
      var id = 15;
      var req = {
        param: sinon.stub().returns(id)
      };

      var res = {
        serverError: sinon.stub(),
        ok: sinon.stub()
      };

      var mock = require('sails-mock-models');
      mock.mockModel(Album, 'findOne', null, new Error('error'));

      AlbumController.findOne(req, res).then(function() {
        assert(res.serverError.calledOnce);
        assert(!res.ok.called);
        assert(req.param.calledWith('id'));
        Album.findOne.restore();
        done();
      });
    });
  });

  describe('#create()', function() {
    it('should call badRequest', () => {
      var req = {};
      var res = {
        badRequest: sinon.spy()
      };

      AlbumController.create(req, res);
      assert(res.badRequest.calledOnce);
    });
  });

  describe('#update()', function() {
    it('should call badRequest', () => {
      var req = {};
      var res = {
        badRequest: sinon.spy()
      };

      AlbumController.update(req, res);
      assert(res.badRequest.calledOnce);
    });
  });

  describe('#destroy()', function() {
    it('should call badRequest', () => {
      var req = {};
      var res = {
        badRequest: sinon.spy()
      };

      AlbumController.destroy(req, res);
      assert(res.badRequest.calledOnce);
    });
  });
});

