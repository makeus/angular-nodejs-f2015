describe('AlbumsRemote', function() {
  var AlbumsRemote, $httpBackend;

  beforeEach(module('musicPlayer:remote'));

  beforeEach(inject(function($injector, _AlbumsRemote_) {
    $httpBackend = $injector.get('$httpBackend');
    AlbumsRemote = _AlbumsRemote_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('#query()', function() {
    it('should get from proper url', function() {
      $httpBackend.expectGET('/api/albums').respond(200, []);
      AlbumsRemote.query();
      $httpBackend.flush();
    });
  });

  describe('#query()', function() {
    it('should get from proper url', function() {
      var id = 21;
      $httpBackend.expectGET('/api/albums/' + id).respond(200, {});
      AlbumsRemote.get({id: id});
      $httpBackend.flush();
    });
  });
})
