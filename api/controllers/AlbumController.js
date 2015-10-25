/**
 * AlbumController
 *
 * @description :: Server-side logic for managing albums
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	find: function(req, res) {
		return Albums.find(req.allParams())
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
		return Albums.findOne(req.allParams())
      .then(function findCB(album){
        res.json(album);
      })
      .catch(function(e) {
        console.error(e);
        res.serverError('Error');
      });
	},

	create: function(req, res) {
    var params = req.allParams();
		return Albums.create(req.allParams())
      .then(function findCB(album){
        res.json(album);
      })
      .catch(function(e) {
        console.error(e);
        res.serverError('Error');
      });
	},

	update: function(req, res) {
		return res.send('update');
	},

	destroy: function(req, res) {
		return res.send('destroy');
	},
};

