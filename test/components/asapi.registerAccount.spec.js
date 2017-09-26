var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asapi = require('../../dist/components/asapi');
var registerAccountData = require('../data/asapi/registerAccount/success.json');

var expect = chai.expect;

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

  describe('when calling registerAccount', () => {
    var mock = function() {
        httpMock.asapi
          .post('/register-account/')
          .reply(200, registerAccountData);
    };

    it('should return success', async () => {
      mock();
      const response = await asapi.registerAccount();
      const body = JSON.parse(response.body);
      expect(body).to.deep.eq(registerAccountData);
    });
  });
});
