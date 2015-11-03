
module.exports = {
  uploadSong: function (req, res) {
    req.file('song').upload({
      maxBytes: 100000000,
      dirname: require('path').resolve(sails.config.appPath, sails.config.files.media)
    }, function (err, uploadedFiles) {
      if (err) return res.negotiate(err);
      if (uploadedFiles.length === 0){
        return res.badRequest('No file was uploaded');
      }
      var Promise = require("bluebird");
      var songs = [];

      Promise.each(uploadedFiles, function(file) {
        return MediaParseService.parseMediaFile(file.fd).then(function(song) {
          songs.push(_.omit(song, 'fd'));
        });
      })
      .catch(function(e) {
        res.negotiate(e);
      })
      .finally(function(){
        res.status(201);
        res.ok(songs);
      });
    });
  },

  find: function(req, res) {
    if(sails.config.environment === 'development') {
      return Song.find(req.allParams())
        .then(function(songs) {
          res.json(songs);
        })
        .catch(function(e) {
          res.negotiate(e);
        });
    }
    res.badRequest('Not supported');
  },

  findOne: function (req, res){
    Song.findOne(req.param('id')).then(function(song) {

      var fileAdapter = require('skipper-disk')();

      // Stream the file down
      fileAdapter.read(song.fd)
        .on('error', function (err){
          return res.serverError(err);
        })
        .pipe(res);
      });
  }
}
