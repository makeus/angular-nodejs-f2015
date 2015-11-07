describe('SongController',function() {
  var sinon = require('sinon');
  var assert = require('assert');
  var SongController;

  beforeEach(function() {
    SongController = require(sails.config.appPath + '/api/controllers/SongController');
  });

  describe('#create()', function() {
    it('should call MediaParseService parseMediaFile for given files from req and call res ok with returned songs', () => {
      var uploadedFiles = ['1231', '5464/asdasd'];
      var song = {
        id: 2,
        title: 'testtitle',
        artist: 'testArists'
      };
      var req = {
        file: sinon.stub().returns({
          upload: function(confing, cb) {
            cb(null, uploadedFiles);
          }
        })
      };

      var res = {
        status: sinon.stub(),
        ok: sinon.stub()
      };

      var Promise = require("bluebird");
      var mock = require('sails-mock-models');
      mock.mockModel(MediaParseService, 'parseMediaFile', Promise.resolve(song));

      return SongController.create(req, res).then(function() {
        assert(res.status.calledWith(201));
        assert(res.ok.calledWith(sinon.match(function(ret) {
          return ret.length === 2;
        })));
        MediaParseService.parseMediaFile.restore();
      });
    });

    it('should call req badRequest if no filenames are given to the callback', () => {
      var uploadedFiles = [];
      var req = {
        file: sinon.stub().returns({
          upload: function(confing, cb) {
            cb(null, uploadedFiles);
          }
        })
      };

      var res = {
        badRequest: sinon.stub(),
        status: sinon.stub(),
        ok: sinon.stub()
      };

      return SongController.create(req, res).then(function() {
        assert(!res.status.calledWith(201));
        assert(res.badRequest.calledOnce);
      });
    });

    it('should call req badRequest if no files are found from req ', () => {
      var uploadedFiles = [];
      var req = {
        file: sinon.stub().returns(null)
      };

      var res = {
        badRequest: sinon.stub(),
        status: sinon.stub(),
        ok: sinon.stub()
      };

      return SongController.create(req, res)
      .catch(function() {
        return require("bluebird").resolve();
      })
      .finally(function() {
        assert(!res.status.calledWith(201));
        assert(res.badRequest.calledOnce);
      });
    });

    it('should call res serverError if errors occur during mediaparsing', () => {
      var uploadedFiles = ['1231', '5464/asdasd'];
      var req = {
        file: sinon.stub().returns({
          upload: function(confing, cb) {
            cb(null, uploadedFiles);
          }
        })
      };

      var res = {
        serverError: sinon.stub(),
        badRequest: sinon.stub(),
        status: sinon.stub(),
        ok: sinon.stub()
      };

      var Promise = require("bluebird");
      var mock = require('sails-mock-models');

      sinon.stub(MediaParseService, 'parseMediaFile', function() {
        return Promise.reject(new Error("oops"));
      });

      return SongController.create(req, res).then(function() {
        assert(!res.status.calledWith(201));
        assert(res.serverError.calledOnce);
        MediaParseService.parseMediaFile.restore();
      });
    });
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

    it('should call Song find on development environment with given parameters', () => {
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

      return SongController.find(req, res).then(function() {
        assert(res.ok.calledWith(mockSong));
        assert(req.allParams.calledOnce);
        Song.find.restore();
      });
    });

    it('should call res serverError on development environment on error', () => {
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

      return SongController.find(req, res).then(function() {
        assert(res.serverError.calledOnce);
        assert(!res.ok.called);
        assert(req.allParams.calledOnce);
        Song.find.restore();
      });
    });
  });

  describe('#findOne()', function() {
    var fileAdapterMock;
    var mockery = require('mockery');
    var mock = require('sails-mock-models');

    afterEach(() => {
      mockery.deregisterMock(fileAdapterMock);
      mockery.disable();
      fileAdapterMock.restore();
    });

    it('should call Song findOne with id parameter and retrieve file and stream it down ', () => {
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

      var fileAdapterStub = new function() {
        var $this = this;
        this.read = function() {
        };
        this.on = function(param1, param2) {
          assert(param1 === 'error');
          param2(new Error('erro'));
          assert(res.serverError.calledOnce);
        };
        this.pipe = function(givenRes) {
          assert(res === givenRes);
        };
      }();

      fileAdapterMock = sinon.mock(fileAdapterStub);
      var skipperMock = sinon.stub().returns(fileAdapterStub);

      mockery.enable();
      mockery.registerMock('skipper-disk', skipperMock);

      fileAdapterMock.expects('read').once().withArgs(fd);
      fileAdapterMock.expects('pipe').once().withArgs(res);

      mock.mockModel(Song, 'findOne', mockSong);

      return SongController.findOne(req, res).then(function() {
        fileAdapterMock.verify();
        Song.findOne.restore();
      });
    });

    it('should call res serverError on error', () => {
      var id = 15;
      var req = {
        param: sinon.stub().returns(id)
      };

      var res = {
        serverError: sinon.stub(),
        ok: sinon.stub()
      };

      mock.mockModel(Song, 'findOne', null, new Error('error'));

      return SongController.findOne(req, res).then(function() {
        assert(res.serverError.calledOnce);
        assert(!res.ok.called);
        assert(req.param.calledWith('id'));
        Song.findOne.restore();
      });
    });


    it('should call res ok with empty object if not found', () => {
      var id = 15;
      var req = {
        param: sinon.stub().returns(id)
      };

      var res = {
        serverError: sinon.stub(),
        ok: sinon.stub()
      };

      mock.mockModel(Song, 'findOne', null);

      return SongController.findOne(req, res).then(function() {
        assert(res.ok.calledOnce);
        assert(req.param.calledWith('id'));
        Song.findOne.restore();
      });
    });
  });
});

