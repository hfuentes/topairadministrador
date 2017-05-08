'use strict';

describe('Controller: TipoequipoCtrl', function () {

  // load the controller's module
  beforeEach(module('pcmadministradorApp'));

  var TipoequipoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TipoequipoCtrl = $controller('TipoequipoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
