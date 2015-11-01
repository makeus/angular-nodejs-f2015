/**
* Album.js
*
* @description :: Metadata for a single album containing songs
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	id: {
  		type: 'integer',
  		autoIncrement: true,
    	primaryKey: true
  	},
    name: {
	    type: 'string',
    	required: true,
    	defaultsTo: 'Unknown Album'
    },
    year: 'string',
    genre: 'string',
    cover: 'string',
    songs: {
      collection: 'song',
      via: 'album'
    }
  },

  findOneByName: function(name) {
    return Album.findOne({name: name});
  }
}

