
module.exports = {
  create: function (req, res) {

    var Promise = require("bluebird");

    if(!req.file('song')) {
      res.badRequest('Song required!');
      return Promise.reject(new Error('Song required'));
    }

    return Promise.promisifyAll(req.file('song')).uploadAsync({
      maxBytes: 100000000,
      dirname: require('path').resolve(sails.config.appPath, sails.config.files.media)
    })
    .then(function (uploadedFiles) {
      if (uploadedFiles.length === 0){
        throw new Error('No file was uploaded');
      }
      var Promise = require("bluebird");
      var songs = [];

      return Promise.each(uploadedFiles, function(file) {
        return MediaParseService.parseMediaFile(file.fd)
        .then(function(song) {
          songs.push(song);
        });
      })
      .then(function(){
        res.status(201);
        res.ok(songs);
      })
      .catch(function(e) {
        res.serverError(e);
      });
    })
    .catch(function(e) {
      res.badRequest(e);
    });
  },

  destroy: function(req, res) {
    res.badRequest('Not supported');
  },

  update: function(req, res) {
    res.badRequest('Not supported');
  },

  find: function(req, res) {
    if(sails.config.environment === 'development') {
      return Song.find(req.allParams())
        .then(function(songs) {
          res.ok(songs);
        })
        .catch(function(e) {
          res.serverError(e);
        });
    }
    res.badRequest('Not supported');
  },

  findOne: function (req, res){
    return Song.findOne(req.param('id')).then(function(song) {
      if(!song) {
        return res.ok({});
      }

      var reader = require('skipper-disk')().read(song.fd);

      reader.on('error', function (err){
        return res.serverError(err);
      });
      reader.pipe(res);
    })
    .catch(function(e) {
      res.serverError(e);
    });
  }
}
