var chai = require('chai');
var nock = require('nock');
var querystring = require('querystring');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var resubscribeAccountSuccessData = require('../data/resubscribeAccount/success.json');

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

  describe('when calling resubscribeAccount', () => {
    var params = {
      account_id: 12345,
      password: 'fake-password',
    };
    var mock = function() {
        httpMock.asmaster
          .post('/resubscribe-account/', querystring.stringify(params))
          .reply(200, resubscribeAccountSuccessData);
    };

    it('should perform success', async () => {
      mock();
      const response = await asmaster.resubscribeAccount(params);
      const body = JSON.parse(response.body);
      expect(body).to.have.keys('success', 'account_id');
    });

    describe('when error', () => {
      var mock = function() {
          httpMock.asmaster
            .post('/resubscribe-account/', querystring.stringify(params))
            .reply(400, {});
      };

      it('should callback a error', () => {
        mock();
        try {
          asmaster.resubscribeAccount(params);
          assert.fail();
        } catch (error) {
          expect(error).not.to.be.null;
        }
      });
    });
  });

});
