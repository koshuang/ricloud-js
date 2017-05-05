var nock = require('nock');

nock.disableNetConnect();

var asmaster = nock('https://asmaster.reincubate.com');

module.exports = {
  asmaster: asmaster,
};
