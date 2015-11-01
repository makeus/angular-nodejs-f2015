/**
* Song.js
*
* @description :: Metadata for a single song
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: 'string',
      required: true,
      defaultsTo: 'Unknown Track'
    },
    artist: {
      type: 'string',
      required: true,
      defaultsTo: 'Unknown Arist'
    },
    trackNumber: 'integer',
    album: {
      model: 'album'
    },
    fd: {
      type: 'string',
      required: true
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.fd;
      return obj;
    }
  }
};

