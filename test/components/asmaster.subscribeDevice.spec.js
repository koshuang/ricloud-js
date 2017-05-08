var querystring = require('querystring');
var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var subscribeDeviceSuccessData = require('../data/subscribeDevice/success.json');
var subscribeDeviceDeviceNotFoundData = require('../data/subscribeDevice/deviceNotFound.json');

var expect = chai.expect;
var assert = chai.assert;

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

  describe('when calling subscribeDevice', () => {
    var params = {
      account_id: 12345,
    };
    var mock = function() {
        httpMock.asmaster
          .post('/unsubscribe-account/', querystring.stringify(params))
          .reply(200, subscribeDeviceSuccessData);
    };

    it('should return account_id', async () => {
      mock();
      const response = await asmaster.unsubscribeAccount(params);
      var body = JSON.parse(response.body);
      expect(body).to.have.keys('success');
    });

    describe('when error', () => {
      var mock = function() {
        httpMock.asmaster
          .post('/unsubscribe-account/', querystring.stringify(params))
          .reply(409, subscribeDeviceDeviceNotFoundData);
      };

      it('should callback a error', async () => {
        mock();
        try {
          await asmaster.unsubscribeAccount(params);
          assert.fail();
        } catch(error) {
          expect(error).not.to.be.null;
          expect(error.message).to.eq('device not found');
        }
      });
    });

  });

});
