'use strict';

var Promise = require('bluebird');
var Geocoder = require('geocoder');

var locationInterface = {
  getLocationByAddress: function(_address){
    //var geoConvertor = Promise.promisify(Geocoder.geocode.bind(Geocoder));

    return new Promise(function(resolve, reject) {
      var geoConvertor = Geocoder.geocode.bind(Geocoder);

      geoConvertor(_address,function(e,data){
        if(e){
          return reject(e);
        }

        if(data.results.length && data.results[0].geometry && data.results[0].geometry.location){
          var geoLocation = data.results[0].geometry.location;
          resolve({
            lat : geoLocation.lat,
            lng : geoLocation.lng,
            address : data.results[0].formatted_address
          });
        }else{
          return reject("Cannot get geo Location of the given place");
        }
      });
    });
  },
  getLocationByCoordinates : function(_lat,_lng){

    return new Promise(function(resolve, reject) {
      var geoConvertor = Geocoder.reverseGeocode.bind(Geocoder);;

      geoConvertor(_lat,_lng,function(e,data){
        if(e){
          return reject(e);
        }

        if(data.results.length && data.results[0].formatted_address){
          resolve({
            lat : _lat,
            lng : _lng,
            address : data.results[0].formatted_address
          });
        }


        resolve(data);

      });

    });


  }

}

module.exports = locationInterface;

/*
latitude: 0,
        longitude: 0,
        altitude: 0,
        locationName: '',
*/
