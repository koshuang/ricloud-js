var chai = require('chai');
var nock = require('nock');
var querystring = require('querystring');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');
var submit2FAChallengeSuccessData = require('../data/submit2FAChallenge/success.json');

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

  describe('when calling submit2FAChallenge', async () => {
    var params = {
      account_id: 12345,
      code: 973763,
    };
    var mock = function() {
        httpMock.asmaster
          .post('/submit-2fa-challenge/', querystring.stringify(params))
          .reply(200, submit2FAChallengeSuccessData);
    };

    it('should submit success', async () => {
      mock();
      const response = await asmaster.submit2FAChallenge(params);
      const body = JSON.parse(response.body);
      expect(body).to.have.keys('account_id');
      expect(body.account_id).to.eq(submit2FAChallengeSuccessData.account_id);
    });

    describe('when error', () => {
      var mock = function() {
          httpMock.asmaster
            .post('/submit-2fa-challenge/', querystring.stringify(params))
            .reply(400, {});
      };

      it('should callback a error', async () => {
        mock();
        try {
          await asmaster.submit2FAChallenge(params);
          assert.fail();
        } catch (error) {
          expect(error).not.to.be.null;
        }
      });
    });
  });

});
