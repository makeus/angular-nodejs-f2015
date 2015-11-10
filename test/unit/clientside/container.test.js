'use strict';

describe('Container', function() {
  var $scope;
  var $compile;
  var Navigation;

  beforeEach(module('musicPlayer:container', function($provide) {
    $provide.value('Navigation', jasmine.createSpyObj('NavigationSpy', ['getView']));
  }));

  beforeEach(inject(function(_$compile_, $rootScope, _Navigation_) {
    $compile = _$compile_;
    $scope = $rootScope.$new();
    Navigation = _Navigation_;
  }));

  it('should set view from Navigation to scope', function() {
    var html = '<container></container>';
    var element = $compile(html)($scope);

    $scope.$digest();

    expect(Navigation.getView).toHaveBeenCalled();

    var view = 'testView';
    Navigation.getView.and.returnValue(view);
    $scope.$digest();
    expect(element.scope().view).toEqual(view);
  });
});
