/* eslint no-use-before-define: 0 */
'use strict';
var request = require('request');

var HOST = 'https://asapi.reincubate.com';
var ENDPOINTS = {
  account: '/account/',
  'register-account': '/register-account/',
  'deregister-account': '/deregister-account/',
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

var asapi = function (endpoint, token, options) {
  this.endpoint = endpoint;
  this.token = token;
  this.options = options;
};

module.exports = asapi;

asapi.prototype.sendGetRequest = function (endpoint, query) {
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

asapi.prototype.sendPostRequest = function (endpoint, body) {
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

asapi.prototype.account = function () {
  return this.sendGetRequest('account');
};

asapi.prototype.registerAccount = function(params) {
  return this.sendPostRequest('register-account', params);
};

asapi.prototype.deregisterAccount = function(params) {
  return this.sendPostRequest('deregister-account', params);
};

asapi.prototype.generateHeaders = function() {
  return {
    Authorization: 'Token ' + this.token,
  };
};
