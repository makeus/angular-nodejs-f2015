/**
* Song.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
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
    }
  }
};

