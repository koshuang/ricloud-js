var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var listServicesData = require('../data/listServices/success.json');

var expect = chai.expect;

describe('Test Asmaster', () => {
  var endpoint = 'lng-asmaster-1';
  var token = 'tGBqNrwvfqHlaGnVsJBdQuWfuKspeZRHfINmBsjJkoSufNYdLcjfPPOwjhHjSHZM';
  var asmaster;

  before((done) => {
    asmaster = new Asmaster(endpoint, token);
    done();
  });

  afterEach(() => {
    httpMock.asmaster.done();
    nock.cleanAll();
  });

  describe('when calling listServices', () => {
    var mock = function() {
        httpMock.asmaster
          .post('/list-services/')
          .reply(200, listServicesData);
    };

    beforeEach(() => {
      mock();
    });

    it('should return services', async () => {
      const response = await asmaster.listServices();
      const body = JSON.parse(response.body);
      expect(body).to.have.keys('services', 'stream_endpoints', 'success');
    });
  });

});
