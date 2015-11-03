/**
 * AlbumController
 *
 * @description :: Server-side logic for managing albums
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	find: function(req, res) {
		return Album.find(req.param('id'))
      .then(function(albums) {
        res.json(albums);
      })
      .catch(function(e) {
        console.error(e);
        res.serverError('Error');
      });
	},

	findOne: function(req, res) {
    var params = req.allParams();
		return Album.findOne(req.allParams()).populateAll()
      .then(function findCB(album){
        res.json(album);
      })
      .catch(function(e) {
        console.error(e);
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

