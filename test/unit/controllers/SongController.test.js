describe('SongController',function() {
  var sinon = require('sinon');
  var assert = require('assert');
  var SongController;

  beforeEach(function() {
    SongController = require(sails.config.appPath + '/api/controllers/SongController');
  });

  describe('#update()', function() {
    it('should call badRequest', () => {
      var req = {};
      var res = {
        badRequest: sinon.spy()
      };

      SongController.update(req, res);
      assert(res.badRequest.calledOnce);
    });
  });

  describe('#destroy()', function() {
    it('should call badRequest', () => {
      var req = {};
      var res = {
        badRequest: sinon.spy()
      };

      SongController.destroy(req, res);
      assert(res.badRequest.calledOnce);
    });
  });

  describe('#find()', function() {
    it('should call badRequest on production enviroment', () => {
      var req = {};
      var res = {
        badRequest: sinon.spy()
      };

      sails.config.environment = 'production';

      SongController.find(req, res);
      assert(res.badRequest.calledOnce);
    });

    it('should call Song find on development environment with given parameters', (done) => {
      var paramData = {
        limit: 10
      };
      var req = {
        allParams: sinon.stub().returns(paramData)
      };
      var res = {
        ok: sinon.stub()
      };

      var mockSong = {
        name: 'ads'
      };

      sails.config.environment = 'development';

      var mock = require('sails-mock-models');
      mock.mockModel(Song, 'find', mockSong);

      SongController.find(req, res).then(function() {
        assert(res.ok.calledWith(mockSong));
        assert(req.allParams.calledOnce);
        Song.find.restore();
        done();
      });
    });

    it('should call res serverError on development environment on error', (done) => {
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

      sails.config.environment = 'development';

      var mock = require('sails-mock-models');
      mock.mockModel(Song, 'find', null, new Error('error'));

      SongController.find(req, res).then(function() {
        assert(res.serverError.calledOnce);
        assert(!res.ok.called);
        assert(req.allParams.calledOnce);
        Song.find.restore();
        done();
      });
    });
  });

  describe('#findOne()', function() {
    var fileAdapterMock;
    var mockery = require('mockery');
    var mock = require('sails-mock-models');

    beforeEach(() => {
      var fileAdapterStub = new function() {
        var $this = this;
        this.read = function() {
        };
        this.on = function(param1, param2) {
          assert(param1 === 'error');
          param2(new Error('erro'));
          assert(res.serverError.calledOnce);
          return $this;
        };
        this.pipe = function(givenRes) {
          assert(res === givenRes);
        };
      }();

      fileAdapterMock = sinon.mock(fileAdapterStub);
      var skipperMock = sinon.stub().returns(fileAdapterStub);

      mockery.enable({
        warnOnReplace: false
      });
      mockery.registerMock('skipper-disk', skipperMock);
    });

    afterEach(() => {
      mockery.deregisterMock(fileAdapterMock);
      mockery.disable();
      fileAdapterMock.restore();
    });

    it('should call Song findOne with id parameter and retrieve file and stream it down ', (done) => {
      var id = 1231;
      var fd = '/test/file.test';
      var req = {
        param: sinon.stub().returns(id)
      };
      var res = {
        serverError: sinon.stub()
      };

      var mockSong = {
        fd: fd
      };

      fileAdapterMock.expects('read').once().withArgs(fd);
      fileAdapterMock.expects('on').once();
      fileAdapterMock.expects('pipe').once().withArgs(res);

      mock.mockModel(Song, 'findOne', mockSong);

      SongController.findOne(req, res).then(function() {
        fileAdapterMock.verify();
        Song.findOne.restore();
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

      mock.mockModel(Song, 'findOne', null, new Error('error'));

      SongController.findOne(req, res).then(function() {
        assert(res.serverError.calledOnce);
        assert(!res.ok.called);
        assert(req.param.calledWith('id'));
        Song.findOne.restore();
        done();
      });
    });
  });
});

