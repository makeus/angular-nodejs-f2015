'use strict';

describe('Upload', function() {
  var $compile, $scope, $q, Upload, uploadDeferred;

  beforeEach(module('musicPlayer:upload', function($provide) {
    $provide.value('Upload', jasmine.createSpyObj('UploadSpy', ['upload']));
  }));

  beforeEach(inject(function(_$q_, _$compile_, $rootScope, _Upload_) {
    $compile = _$compile_;
    $q = _$q_;
    $scope = $rootScope.$new();
    Upload = _Upload_
  }));

  describe('#uploadFiles()', function() {
    it('doesnt do anything with empty files', function() {
      var element = $compile('<upload></upload>')($scope);
      $scope.$digest();

      $scope.uploadFiles();
      expect(Upload.upload).not.toHaveBeenCalled();

      $scope.uploadFiles([]);
      expect(Upload.upload).not.toHaveBeenCalled();
    });

    it('creates upload-bars after calling Upload upload', function() {
      var files = ['asdas', '65464fgdfdgf', '453534'];

      Upload.upload.and.returnValue($q.resolve());

      var element = $compile('<upload></upload>')($scope);
      $scope.$digest();

      $scope.uploadFiles(files);

      expect(Upload.upload.calls.count()).toEqual(files.length);
      expect(element.find('upload-bar').length).toEqual(files.length);
    });
  });
});

describe('Upload-Bar', function() {
  var $compile, $scope, $q, $rootScope;

  beforeEach(module('musicPlayer:upload'));

  beforeEach(inject(function(_$q_, _$compile_, _$rootScope_) {
    $compile = _$compile_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  describe('#uploadFiles()', function() {
    it('should set complete true when promise is resolved', function() {
      $scope.promise = $q.resolve();
      var element = $compile('<upload-bar promise="promise"></upload-bar>')($scope);
      $scope.$digest();
      expect(element.scope().complete).toBe(true);
    });

    it('should set failure true when promise is rejected', function() {
      $scope.promise = $q.reject();
      var element = $compile('<upload-bar promise="promise"></upload-bar>')($scope);
      $scope.$digest();
      expect(element.scope().failure).toBe(true);
    });

   it('should set loaded and total values when promise returns a progress event', function() {
      var total = 32414345;
      var loaded = 54366;
      var deferred = $q.defer();
      $scope.promise = deferred.promise;
      var element = $compile('<upload-bar promise="promise"></upload-bar>')($scope);
      $scope.$digest();

      deferred.notify({
        total: total,
        loaded: loaded
      });
      $scope.$digest();

      expect(element.scope().total).toEqual(total);
      expect(element.scope().loaded).toEqual(loaded);
    });
  });
});
