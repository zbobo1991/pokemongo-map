'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var Winston = require('winston');
var colors = require('colors');
const FS = require('fs');

var logger = new (Winston.Logger)({
  transports: [
    new (Winston.transports.Console)(),
    new (Winston.transports.File)({
      name: 'info-log',
      filename: 'info.log',
      level: 'info'
    }),
    new (Winston.transports.File)({
      name: 'error-log',
      filename: 'error.log',
      level: 'error'
    })
  ]
});

var utils_fn = {
  addNewPokemon : function(_id,_number,_name,_lat,_lng,_classification,_weight,_height,_timeleft){
    var convertedName = _name;
    if (_name == "Nidoran F") {
      convertedName = "Nidoran";
    }
    else if (_name == "Nidoran M") {
      convertedName = "Nidorano";
    }
    else if (_name == "Mr. Mime") {
      convertedName = "Mr-Mime";
    }

    var avatar = "http://icons.iconarchive.com/icons/hektakun/pokemon/72/" + _number + "-" + convertedName + "-icon.png";

    var date = new Date(null);
    date.setSeconds(_timeleft/1000);
    var timeLeft = (date.getUTCMinutes() > 0 ? date.getUTCMinutes() + "m " : "") + date.getUTCSeconds() + "s";

    return {
      id:_id,
      name:convertedName,
      classification:_classification,
      location:{
        lat:_lat,
        lng:_lng
      },
      properties:{
        weight:_weight,
        height:_height,
        avatar: avatar
      },
      timeleft:timeLeft,
      timestamp:new Date().getTime()
    }
  },
  loadAppConfig : function(){
    var pokemonFile = "./config/appConfig.json";
    return new Promise(function(resolve, reject){
      FS.readFile(pokemonFile, function (e, data) {
        if (e){
          reject(e);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
  },
  loadPokemons : function(){
    var pokemonFile = "./config/pokemon.json";
    return new Promise(function(resolve, reject){
      FS.readFile(pokemonFile, function (e, data) {
        if (e){
          reject(e);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
  },
  loadScanPoints : function(_method = "C"){
    //method:
    // C : Circularity
    // R : Radiation
    var filePath = "./config/CircularityScan.json";
    if("C" == _method){
      filePath = "./config/CircularityScan.json";
    }else{
      filePath = "./config/RadiationScan.json";
    }

    return new Promise(function(resolve, reject){
      FS.readFile(filePath, function (e, data) {
        if (e){
          reject(e);
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

  },
  createWebPage: function(_location,_pokemons,_mapKey,_html = "pokemonMap.html"){
    //This is a temporary solution, next generation will be a live web-service.
    //step 1 : load template
    //step 2 : replace with values
    //step 3 : save data to result html file
    var templateFile = "./config/index.template";
    return new Promise(function(resolve, reject){
      FS.readFile(templateFile, function (e, data) {
        if (e){
          reject(e);
        }
        try {
          var htmlString = data;
          //replace map key
          htmlString = _.replace(htmlString, 'GOOGLE_MAPS_API_KEY', _mapKey);
          //replace location::lat
          htmlString = _.replace(htmlString, 'LOCATION_LAT', _location.lat);
          //replace map key
          htmlString = _.replace(htmlString, 'LOCATION_LNG', _location.lng);
          //replace map key
          htmlString = _.replace(htmlString, 'ALL_POKEMONS_DATA', JSON.stringify(_pokemons));

          FS.writeFile(_html, htmlString, 'utf8', function(err){
            if (err){
              reject(err);
            }
            resolve({
              "status":"OK",
              "message":("Html file has been generated as "+_html+", double click the file to see the pokemon GO map.").bold
            });
          });

        } catch (e) {
          reject(e);
        }
      });
    });
  },
  log : function(_level = "info",_msg = "unset"){
    var marker = "[?]";
    switch (_level) {
      case "info":
        marker = "[+]";
        _msg = _msg.green;
        break;
      case "error":
        marker = "[-]";
        _msg = _msg.red;
        break;
      case "warn":
        marker = "[!]";
        _msg = _msg.yellow;
        break;
      default:
        marker = "[?]";
        _msg = _msg.blue;
    }
    logger.log(_level,marker+" "+new Date()+" " + _msg);
  }
}

module.exports = utils_fn;
