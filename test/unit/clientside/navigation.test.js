'use strict';

describe('Navigation', function() {

  var Navigation;
  beforeEach(module('musicPlayer:navigation'));

  beforeEach(inject(function(_Navigation_) {
    Navigation = _Navigation_;
  }));

  describe('#setView(), #getView()', function() {
    it('Should work as expected', function() {
      Navigation.setView('testView1');
      expect(Navigation.getView()).toEqual('testView1');
      Navigation.setView('testView2');
      expect(Navigation.getView()).toEqual('testView2');
      Navigation.setView('testView3');
      Navigation.setView('testView4');
      expect(Navigation.getView()).toEqual('testView4');
    });
  });

  describe('#onViewChange()', function() {
    it('should set callback to be called when setView is called', function() {
      var spy1 = jasmine.createSpy();

      Navigation.onViewChange(spy1);
      expect(spy1).not.toHaveBeenCalled();

      Navigation.setView('testView');
      expect(spy1).toHaveBeenCalled();

      var spy2 = jasmine.createSpy();
      Navigation.onViewChange(spy2);

      Navigation.setView('testView2');
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });
  });
});

describe('Navigation directive', function() {
  var Navigation, $compile, $scope;

  beforeEach(module('musicPlayer:navigation', function($provide) {
    $provide.value('Navigation', {setView: jasmine.createSpy()});
  }));

  beforeEach(inject(function(_Navigation_, _$compile_, $rootScope) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    Navigation = _Navigation_;
  }));

  describe('#setAlbumView()', function() {
    it('should set Navigation to "album" when clicked', function() {
      var element = $compile('<navigation><button ng-click="setAlbumView()"></button></navigation>')($scope);
      $scope.$digest();
      element.find('button').click();

      expect(Navigation.setView).toHaveBeenCalledWith('album');
      expect(element.scope().view).toEqual('album');
    });
  });

  describe('#setUploadView()', function() {
    it('should set Navigation to "upload" when clicked', function() {
      var element = $compile('<navigation><button ng-click="setUploadView()"></button></navigation>')($scope);
      $scope.$digest();
      element.find('button').click();

      expect(Navigation.setView).toHaveBeenCalledWith('upload');
      expect(element.scope().view).toEqual('upload');
    });
  });
});
