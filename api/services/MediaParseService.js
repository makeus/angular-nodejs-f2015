module.exports = {

  parseDirectoryMedias: function(dir) {
    var Promise = require("bluebird");
    var fs = Promise.promisifyAll(require("fs"));

    fs.readdirAsync(dir).then(function(files){
      _.forEach(files, (file) => {
        MetadataService.getMetadataFromFilename(dir + file).then(function(metadata) {
          Album.findOneByName(metadata.album)
          .then(function(album) {
            if(!album || !album.id) {
              return Album.create({
                  name: metadata.album,
                  year: metadata.year,
                  genre: metadata.genre.length ? metadata.genre[0] : undefined
              });
            }
            return album;
          })
          .then(function(album) {
            if(metadata.picture.length) {
              CoverService.uploadCover(album.id, metadata.picture[0]).then(function(coverUrl) {
                return Album.update({id: album.id}, {cover: coverUrl});
              });
            }
            return Song.create({
                title: metadata.title,
                artist: metadata.artist,
                trackNumber: metadata.track.no,
                album: album.id
              });
          });
        });
      });
    });
  }
};
