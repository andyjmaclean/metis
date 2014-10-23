'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('UIM App', function() {

  describe('Organisation list view', function() {

    beforeEach(function() {
      browser.get('app/index.html#/organisations');
    });


    it('should filter the organisation list as user types into the search box', function() {

      var phoneList = element.all(by.repeater('organisation in organisations'));
      var query = element(by.model('query'));

      expect(phoneList.count()).toBe(6);
      
      query.sendKeys('H');
      expect(phoneList.count()).toBe(1);

      query.clear();
      query.sendKeys('e');
      expect(phoneList.count()).toBe(4);
    });
  });
});
