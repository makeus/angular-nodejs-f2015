module.exports = {

  parseDirectoryMedias: function(dir) {
    var Promise = require("bluebird");
    var fs = Promise.promisifyAll(require("fs"));

    return fs.readdirAsync(dir).then(function(files){
      return Promise.each(files, (file) => {
        return MediaParseService.parseMediaFile(require('path').resolve(dir, file));
      });
    });
  },
  parseMediaFile: function(filepath) {
    var Promise = require("bluebird");
    return Song.findOne({fd: filepath}).then(function(song) {
      if(!song) {
        return MetadataService.getMetadataFromFilename(filepath).then(function(metadata) {
            return Album.findOneByName(metadata.album)
            .then(function(album) {
              if(!album) {
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
                album: album.id,
                fd: filepath
              });
            });
        });
      }
      return song;
    });
  }
};
