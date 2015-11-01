
var imageFormats = ['png', 'jpg', 'gif', 'tiff']

module.exports = {
    uploadCover: function(albumId, picture) {
      var Promise = require("bluebird");
      var fs = Promise.promisifyAll(require("fs"));
      if(!_.contains(imageFormats, picture.format)) {
        throw 'Unsupported image format';
      }
      var url = sails.config.files.covers + albumId + '.' + picture.format;
      return fs.writeFileAsync(sails.config.appPath + '/assets' + url, picture.data).then(() => {return url});
    },
    getCover: function(albumId) {
      var Promise = require("bluebird");
      var fs = Promise.promisifyAll(require("fs"));
      return fs.readdirAsync(sails.config.files.covers)

        .then(function(files) {
          var found;
          _.forEach(files, (file) => {
            if(new RegExp(albumId + '\.(' + imageFormats.join('|') + ')', 'i').exec(file)) {
              found = file;
            }
          })
          return found;
        })
        .then(function(file) {
          return fs.readFileAsync(sails.config.files.covers + file);
        });
    }
};
