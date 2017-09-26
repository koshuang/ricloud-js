var nock = require('nock');

nock.disableNetConnect();

var asmaster = nock('https://asmaster.reincubate.com');
var asapi = nock('https://asapi.reincubate.com');

module.exports = {
  asmaster: asmaster,
  asapi: asapi,
};
