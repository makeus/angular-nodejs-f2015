(function() {
    'use strict';

    angular.module('musicPlayer:remote', ['ngResource'])

    .factory('AlbumsRemote', ['$resource', function($resource){
      return $resource('/api/albums/:id', null, {
        query: {
          method: 'GET',
          isArray: true
        }
      });
    }]);

}())
