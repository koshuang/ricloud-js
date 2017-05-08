var querystring = require('querystring');
var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var unsubscribeDeviceSuccessData = require('../data/unsubscribeDevice/success.json');
var unsubscribeDeviceDeviceNotFoundData = require('../data/unsubscribeDevice/deviceNotFound.json');

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

  describe('when calling subscribeDevice', () => {
    var params = {
      account_id: 12345,
      device_id: 87973,
    };
    var mock = function() {
        httpMock.asmaster
          .post('/unsubscribe-device/', querystring.stringify(params))
          .reply(200, unsubscribeDeviceSuccessData);
    };

    it('should return account_id', async () => {
      mock();
      const response = await asmaster.unsubscribeDevice(params);
      var body = JSON.parse(response.body);
      expect(body).to.have.keys('success');
    });

    describe('when error', () => {
      var mock = function() {
        httpMock.asmaster
          .post('/unsubscribe-device/', querystring.stringify(params))
          .reply(409, unsubscribeDeviceDeviceNotFoundData);
      };

      it('should callback a error', async () => {
        mock();
        try {
          asmaster.unsubscribeDevice(params);
        } catch (error) {
          expect(error).not.to.be.null;
          expect(error.message).to.eq('device not found');

        }
      });
    });

  });

});
