var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asapi = require('../../dist/components/asapi');
var loginSuccessData = require('../data/asapi/submitTask/login/success.json');

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

  describe('when calling submitTask', () => {
    describe('when submit log-in action', () => {
      var params = {
        service: 'icloud',
        action: 'log-in',
        account: 'ursuhump@icloud.com',
        password: 'Sb20170926',
      };
      var mock = function() {
          httpMock.asapi
            .post('/submit-task/')
            .reply(200, loginSuccessData);
      };

      it('should return success', async () => {
        mock();
        const response = await asapi.submitTask('/submit-task/', params);
        const body = JSON.parse(response.body);
        expect(body).to.deep.eq(loginSuccessData);
      });
    });

  });
});
