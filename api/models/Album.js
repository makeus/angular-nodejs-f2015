/**
* Album.js
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
    artist: {
		type: 'string',
      	required: true,
      	defaultsTo: 'Unknown Arist'
    },
    name: {
		type: 'string',
      	required: true,
      	defaultsTo: 'Unknown Album'
    }
  }
}

