'use strict';

/* jasmine specs for controllers go here */
describe('uimApp uimControllers', function() {


  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
    	  console.log('expected: ' + expected);
    	  return angular.equals(this.actual, expected);
      }
    });
  });
  
  beforeEach(module('uimApp'));
  beforeEach(module('uimServices'));

/*  
  describe('OrganisationsCtrl', function(){

    var scope, ctrl, $httpBackend;
   
    var organisationsArray = [{"id":"1","name":"MIMO"},{"id":"2","name":"DPLA"}];
    	
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
    	
        $httpBackend.expectGET('data/organisations.json')
    		.respond( {"total":6} );
    	
    	$httpBackend.expectGET('data/organisations.json?rows=2&start=0')
        	.respond( organisationsArray );
        
    	scope = $rootScope.$new();
        ctrl = $controller('OrganisationsCtrl', {$scope: scope});
      }));

    
    it('should create "organisations" model', function() {
        expect(scope.organisations).toEqualData([]);
        $httpBackend.flush();        
        expect(scope.organisations).toEqualData(organisationsArray);
    });

  });

  
  describe('OrganisationCtrl', function(){
    var scope, $httpBackend, ctrl,
        xyzData = function() {
          return {
            name: 'test organisation'
          };
        };


    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('data/organisations/xyz.json').respond(xyzData());

      $routeParams.organisationId = 'xyz';
      scope = $rootScope.$new();
      ctrl = $controller('OrganisationCtrl', {$scope: scope});
    }));


    it('should fetch organisation detail', function() {
	      expect(scope.organisation).toEqualData(undefined);
	      $httpBackend.flush();
	      expect(scope.organisation).toEqualData(xyzData());
	    });
	  });  
  */
});
