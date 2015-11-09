
var imageFormats = ['png', 'jpg', 'gif', 'tiff']

module.exports = {
    uploadCover: function(albumId, picture) {
      var Promise = require("bluebird");
      var fs = Promise.promisifyAll(require("fs"));
      if(!_.contains(imageFormats, picture.format)) {
        return Promise.reject(new Error('Unsupported image format'));
      }
      var url = sails.config.files.covers + albumId + '.' + picture.format;
      return fs.writeFileAsync(sails.config.appPath + '/assets' + url, picture.data).then(() => {
        return fs.writeFileAsync(sails.config.appPath + '/.tmp/public/' + url).catch(() => {
          return Promise.resolve(url);
        });
      })
      .then(() => {return url});
    }
};
