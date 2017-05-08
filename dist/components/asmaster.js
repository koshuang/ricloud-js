/* eslint no-use-before-define: 0 */
'use strict';
var request = require('request');

var HOST = 'https://asmaster.reincubate.com';
var ENDPOINTS = {
  list_services: '/list-services/',
  list_subscriptions: '/list-subscriptions/',
  subscribe_account: '/subscribe-account/',
  perform_2fa_challenge: '/perform-2fa-challenge/',
  submit_2fa_challenge: '/submit-2fa-challenge/',
  list_devices: '/list-devices/',
  subscribe_device: '/subscribe-device/',
  resubscribe_account: '/resubscribe-account/',
  unsubscribe_device: '/unsubscribe-device/',
  unsubscribe_account: '/unsubscribe-account/',
};


function getEndpoint(endpointName) {
  return HOST + ENDPOINTS[endpointName];
}

function generateOptions(method, endpoint, headers, data) {
  var options = {
    uri: getEndpoint(endpoint),
    headers: headers,
    method: method,
  };
  options[method === 'GET' ? 'qs' : 'form'] = data;

  return options;
}

function handleErrorResponse(response, callback) {
  try {
    var body = JSON.parse(response.body);

    callback(new Error(body.message || body.error));
  } catch (error) {
    callback(new Error(response.body));
  }
}

var asmaster = function (endpoint, token, options) {
  this.endpoint = endpoint;
  this.token = token;
  this.options = options;
};

asmaster.prototype.sendGetRequest = function (endpoint, query, cb) {
  var headers = this.generateHeaders();
  var options = generateOptions('GET', endpoint, headers, query);

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
      }
      else if (response.statusCode >= 400) {
        handleErrorResponse(response, reject);
      } else {
        resolve(response);
      }
    });
  });
};

asmaster.prototype.sendPostRequest = function (endpoint, body, cb) {
  var headers = this.generateHeaders();
  var options = generateOptions('POST', endpoint, headers, body);

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
      }
      else if (response.statusCode >= 400) {
        handleErrorResponse(response, reject);
      } else {
        resolve(response);
      }
    });
  });
};

asmaster.prototype.generateHeaders = function() {
  return {
    Authorization: 'Token ' + this.token,
  };
};

asmaster.prototype.listSubscriptions = function(params) {
  return this.sendPostRequest('list_subscriptions', params);
};

asmaster.prototype.listServices = function() {
  return this.sendPostRequest('list_services');
};

asmaster.prototype.subscribeAccount = function(params) {
  return this.sendPostRequest('subscribe_account', params);
};

asmaster.prototype.listDevices = function(params) {
  return this.sendPostRequest('list_devices', params);
};

asmaster.prototype.perform2FAChallenge = function(params) {
  return this.sendPostRequest('perform_2fa_challenge', params);
};

asmaster.prototype.resubscribeAccount = function(params) {
  return this.sendPostRequest('resubscribe_account', params);
};
asmaster.prototype.unsubscribeAccount = function(params) {
  return this.sendPostRequest('unsubscribe_account', params);
};

asmaster.prototype.perform2FAChallenge = function(params) {
  return this.sendPostRequest('perform_2fa_challenge', params);
};

asmaster.prototype.submit2FAChallenge = function(params) {
  return this.sendPostRequest('submit_2fa_challenge', params);
};

asmaster.prototype.subscribeDevice = function(params) {
  return this.sendPostRequest('subscribe_device', params);
};

asmaster.prototype.unsubscribeDevice = function(params) {
  return this.sendPostRequest('unsubscribe_device', params);
};

module.exports = asmaster;
