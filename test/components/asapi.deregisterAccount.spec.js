var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asapi = require('../../dist/components/asapi');
var deregisterAccountData = require('../data/asapi/deregisterAccount/success.json');
var accountNotFoundData = require('../data/asapi/deregisterAccount/account-not-found.json');

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
    nock.cleanAll();
  });

  describe('when calling deregisterAccount', () => {
    var mock = function() {
        httpMock.asapi
          .post('/deregister-account/')
          .reply(200, deregisterAccountData);
    };

    it('should return success', async () => {
      mock();
      const response = await asapi.deregisterAccount();
      const body = JSON.parse(response.body);
      expect(body).to.deep.eq(deregisterAccountData);
    });

    describe('when account not found', () => {
      var mock = function() {
          httpMock.asapi
            .post('/deregister-account/')
            .reply(400, accountNotFoundData);
      };

      it('should throw a error', async () => {
        mock();
        try {
          await asapi.deregisterAccount();
          assert.fail();
        } catch (error) {
          expect(error.message).to.eq('No such account.');
        }
      });
    });
  });
});
