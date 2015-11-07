/**
 * AlbumController
 *
 * @description :: Server-side logic for managing albums
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	find: function(req, res) {
		return Album.find(req.allParams())
      .then(function(albums) {
        res.ok(albums);
      })
      .catch(function(e) {
        console.log(e);
        res.serverError('Error');
      });
	},

	findOne: function(req, res) {
		return Album.findOne(req.param('id')).populateAll()
      .then(function findCB(album){
        res.ok(album);
      })
      .catch(function(e) {
        res.serverError('Error');
      });
	},

	create: function(req, res) {
    return res.badRequest('Not supported');
	},

	update: function(req, res) {
		return res.badRequest('Not supported');
	},

	destroy: function(req, res) {
		return res.badRequest('Not supported');
	},
};

