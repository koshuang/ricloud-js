var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asapi = require('../../dist/components/asapi');
var accountData = require('../data/asapi/account/success.json');
var authInvalidData = require('../data/asapi/account/auth-invalid.json');

var expect = chai.expect;
var assert = chai.assert;

describe('Test Asapi', () => {
  var endpoint = 'lng-asmaster-1';
  var token = 'IWjpKwDjgSKCANPntqZoyuALgjSSBemdWMWnSKxEhkFzVhiJtWFTVLTzAVzFyMVU';
  var asapi;

  before(() => {
    asapi = new Asapi(endpoint, token);
  });

  afterEach(() => {
    // httpMock.asapi.done();
    nock.cleanAll();
  });

  describe('when calling account', () => {
    var mock = function() {
        httpMock.asapi
          .get('/account/')
          .reply(200, accountData);
    };

    it('should return devices', async () => {
      mock();
      const response = await asapi.account();
      const body = JSON.parse(response.body);
      expect(body).to.deep.eq(accountData);
    });

    describe('when auth failed', () => {
      var mock = function() {
          httpMock.asapi
            .get('/account/')
            .reply(401, authInvalidData);
      };

      it('should throw a error', async () => {
        mock();
        try {
          await asapi.account();
          assert.fail();
        } catch (error) {
          expect(error.message).to.eq('Failed to authenticate credentials for reason: invalid token.');
        }
      });
    });
  });
});
