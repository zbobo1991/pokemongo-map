'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var rpcApi = require('./3rd/rpc');

var envelope = rpcApi.protos.RequestEnvelope;
var PROVIDER = "google";
var END_POINT = 'https://pgorelease.nianticlabs.com/plfe/rpc';

var playerInfo = {
  getPlayerEndpoint : function(latitude, longitude, token){

    const endpoint = 'https://pgorelease.nianticlabs.com/plfe/rpc';
    const requests = [
      new envelope.Request(envelope.Request.RequestType.GET_PLAYER),
      new envelope.Request(envelope.Request.RequestType.GET_HATCHED_EGGS),
      new envelope.Request(envelope.Request.RequestType.GET_INVENTORY),
      new envelope.Request(envelope.Request.RequestType.CHECK_AWARDED_BADGES),
      new envelope.Request(envelope.Request.RequestType.DOWNLOAD_SETTINGS)
    ];

    return new Promise(function(resolve, reject) {
      rpcApi.wrap(latitude, longitude, PROVIDER, token)
        .sendRaw(endpoint, requests)
        .then(function(response) {
          resolve('https://' + response.api_url + '/rpc');
        })
        .catch(function(e){
          reject(e);
        });
    });
  }
}

module.exports = playerInfo;
