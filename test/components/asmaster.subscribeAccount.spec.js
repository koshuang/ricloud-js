var chai = require('chai');
var nock = require('nock');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var subscribeAccountSuccessData = require('../data/subscribeAccount/success.json');
var subscribeAccountTwoFaRequiredData = require('../data/subscribeAccount/twoFaRequired.json');

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

  describe('when calling subscribeAccount', () => {
    var params = {
      service: 'icloud',
      username: 'test@icloud.com',
      password: '12345678',
    };
    var mock = function() {
        httpMock.asmaster
          .post('/subscribe-account/')
          .reply(200, subscribeAccountSuccessData);
    };

    it('should return account_id', async () => {
      mock();
      const response = await asmaster.subscribeAccount(params);
      const body = JSON.parse(response.body);
      expect(body).to.contains.keys('account_id', 'success');
      expect(body.account_id).to.eq(subscribeAccountSuccessData.account_id);
    });

    describe('when 2FA required', () => {
      const mock = function() {
        httpMock.asmaster
          .post('/subscribe-account/')
          .reply(409, subscribeAccountTwoFaRequiredData);
      };

      it('should throw a error', async () => {
        mock();
        try {
          await asmaster.subscribeAccount(params);
          assert.fail();
        } catch (error) {
          expect(error).not.to.be.null;
        }
      });
    });

  });

});
