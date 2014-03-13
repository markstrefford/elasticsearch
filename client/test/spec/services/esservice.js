'use strict';

describe('Service: Esservice', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var Esservice;
  beforeEach(inject(function (_Esservice_) {
    Esservice = _Esservice_;
  }));

  it('should do something', function () {
    expect(!!Esservice).toBe(true);
  });

});
