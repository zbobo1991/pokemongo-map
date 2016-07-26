'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var rpcApi = require('./3rd/rpc');
var getNeighboringCellIds = require('./3rd/get-neighboring-cell-ids');

var PROVIDER = "google";
// constants/variables
var envelope = rpcApi.protos.RequestEnvelope;

var MapData = {
  getPokemonNearBy : function(_endpoint,_latitude, _longitude, _token){
    var mapObjectMessage = new rpcApi.protos.MapObjectsRequest({
      cell_ids: getNeighboringCellIds(_latitude, _longitude),
      since_timestamp_ms: [],
      latitude: _latitude,
      longitude: _longitude
    });

    var requests = [
      new envelope.Request(envelope.Request.RequestType.GET_MAP_OBJECTS,
        mapObjectMessage.encode().toBuffer())
    ];

    return new Promise(function(resolve, reject) {
      rpcApi.wrap(_latitude, _longitude, PROVIDER, _token)
        .sendRaw(_endpoint, requests)
        .then(function(response) {

          if(!response.returns){
            reject("Cannot get any pokemon cells");
          }

          var mapCells = rpcApi.protos.MapObjectsResponse.decode(response.returns[0]).map_cells;
          resolve(mapCells);
        })
        .catch(function(e){
          reject(e);
        });
    });
  }
}

module.exports = MapData;
