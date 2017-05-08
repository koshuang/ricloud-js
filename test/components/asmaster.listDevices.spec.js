var querystring = require('querystring');
var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var listDevicesData = require('../data/listDevices/success.json');
var listDevicesErrorData = require('../data/listDevices/invalid-parameter.json');

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

  describe('when calling listDevices', () => {
    var params = { account_id: 99951 };
    var mock = function() {
        httpMock.asmaster
          .post('/list-devices/', querystring.stringify(params))
          .reply(200, listDevicesData);
    };

    it('should return devices', async () => {
      mock();
      const response = await asmaster.listDevices(params);
      var body = JSON.parse(response.body);
      expect(body).to.have.keys('devices', 'success');
      expect(body.devices[0]).to.have.keys(
        'ios_version', 'device_tag', 'colour', 'device_name',
        'latest-backup', 'model', 'device_id', 'serial', 'name'
      );
    });

    describe('when parameter is invalid', () => {
      var mock = function() {
          httpMock.asmaster
            .post('/list-devices/', querystring.stringify(params))
            .reply(400, listDevicesErrorData);
      };

      it('should callback a error', async () => {
        mock();
        try {
          await asmaster.listDevices(params);
          assert.fail();
        } catch (error) {
          expect(error).not.to.be.null;
        }
      });
    });
  });
});
