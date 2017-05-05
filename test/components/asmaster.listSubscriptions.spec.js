var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var listSubscriptionsData = require('../data/listSubscriptions/success.json');

var expect = chai.expect;

describe('Test Asmaster', () => {
  var endpoint = 'lng-asmaster-1';
  var token = 'tGBqNrwvfqHlaGnVsJBdQuWfuKspeZRHfINmBsjJkoSufNYdLcjfPPOwjhHjSHZM';
  var asmaster;

  before(() => {
    asmaster = new Asmaster(endpoint, token);
  });

  afterEach(() => {
    httpMock.asmaster.done();
    nock.cleanAll();
  });

  describe('when calling listSubscriptions', () => {
    var mock = function() {
        httpMock.asmaster
          .post('/list-subscriptions/', { service: 'icloud' })
          .reply(200, listSubscriptionsData);
    };

    beforeEach(() => {
      mock();
    });

    it('should return accounts', async () => {
      const params = { service: 'icloud' };
      const response = await asmaster.listSubscriptions(params);
      const body = JSON.parse(response.body);
      expect(body).to.have.keys('accounts', 'success');
    });
  });

});
