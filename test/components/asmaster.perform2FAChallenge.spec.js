var chai = require('chai');
var nock = require('nock');
var querystring = require('querystring');
var httpMock = require('../helpers/httpMock');
var Asmaster = require('../../dist/components/asmaster');

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

  describe('when calling perform2FAChallenge', () => {
    var params = {
      account_id: 12345,
      device_id: 54321,
    };
    var mock = function() {
        httpMock.asmaster
          .post('/perform-2fa-challenge/', querystring.stringify(params))
          .reply(200, {});
    };

    it('should perform success', async () => {
      mock();
      const response = await asmaster.perform2FAChallenge(params);

      expect(response.statusCode).to.eq(200);
    });

    describe('when error', () => {
      var mock = function() {
          httpMock.asmaster
            .post('/perform-2fa-challenge/', querystring.stringify(params))
            .reply(400, {});
      };

      it('should callback a error', async () => {
        mock();
        try {
          await asmaster.perform2FAChallenge(params);
          assert.fail();
        } catch (error) {
          console.log(error);
          expect(error).not.to.be.null;
        }
      });
    });
  });

});
