'use strict';

var _ = require('lodash');
var program = require('commander');
var Promise = require('bluebird');
var Login = require('./src/login');
var Location = require('./src/location');
var PlayerInfo = require('./src/playerInfo');
var MapData = require('./src/mapData');
var Utils = require('./src/utils');

//global configs
var configs = {};

function dataProcess(){
  //Step 1: login to get access token
  //Step 2: get origin coordinate point
  //Step 3: load scan matrix [Circularity,Radiation]
  //Step 4: generate data

  if("google" == program.method){
    Utils.log('warn',"Loading application configs");
    var configsPromise = Utils.loadAppConfig();
    Utils.log('warn',"Login with google account: "+program.username);
    var tokenPromise = Login.googleAuth(program.username, program.password);
    Utils.log('warn',"Get location from user input: "+program.location);
    var locationPromise = Location.getLocationByAddress(program.location);

    Promise.join(configsPromise,tokenPromise,locationPromise,function(appConfigs,token,location){
      Utils.log('info',"Application config has been loaded.");
      configs = appConfigs;
      Utils.log('info',"Login success!!!");
      configs.token = token;
      Utils.log('info',"Get location as : "+location.address);
      configs.location = location;
      Utils.log('warn',"Get user PLAY_END_POINT(access api)");
      return PlayerInfo.getPlayerEndpoint(location.lat,location.lng,token);
    })
    .then(function(endpoint) {
      Utils.log('info',"PLAY_END_POINT(access api) fetched!!!");
      configs.endpoint = endpoint;
      Utils.log('info',"access api: "+endpoint);
      var scanPoints = "C";
      if(program.radiation){
        scanPoints = "R";
        Utils.log('warn',"Loading scanning points: Radiation");
      }else{
        Utils.log('warn',"Loading scanning points: Circularity");
      }
      var loadScanPointsPromise = Utils.loadScanPoints(scanPoints);
      var loadPokemonsPromise = Utils.loadPokemons();
      Utils.log('warn',"Loading pokemon data...");
      return [loadScanPointsPromise,loadPokemonsPromise];
    })
    .spread(function(scanningPoints,pokemonData){
      Utils.log('info',"Pokemon data has been loaded!!!");
      configs.pokemonConfig = pokemonData;
      Utils.log('info',"Scanning points has been loaded!!!");
      var scanningPointsPromiseList = [];
      _.forEach(scanningPoints,function(scanningPoint){
        scanningPointsPromiseList.push(
          MapData.getPokemonNearBy(
            configs.endpoint,
            (scanningPoint.x * configs.distance) + configs.location.lat,
            (scanningPoint.y * configs.distance) + configs.location.lng,
            configs.token)
            .then(function(pokemonsSet){
              if(pokemonsSet.length){
                _.forEach(pokemonsSet,function(pokemons){
                  pokemons.forts = {};//make data much smaller, might be useful future
                  if(pokemons.wild_pokemon.length){
                    _.forEach(pokemons.wild_pokemon,function(wildPokemon){
                      if(wildPokemon.pokemon_data && wildPokemon.pokemon_data.pokemon_id){
                        var pokemonId = wildPokemon.pokemon_data.pokemon_id;
                        var pokemonItem = configs.pokemonConfig[pokemonId - 1]?configs.pokemonConfig[pokemonId - 1]:null;
                        var ID = wildPokemon.spawn_point_id+":"+pokemonId;
                        if(pokemonItem){
                          configs.nearByPokemons.push(Utils.addNewPokemon(
                            ID,
                            pokemonItem['Number'],
                            pokemonItem['Name'],
                            wildPokemon.latitude,
                            wildPokemon.longitude,
                            pokemonItem['Classification'],
                            pokemonItem['Weight'],
                            pokemonItem['Height'],
                            wildPokemon.time_till_hidden_ms
                          ));
                          Utils.log('info',"Pokemon detected: "+pokemonItem['Name']+"\twith ID :\t"+ID);
                        }
                      }
                    });
                  }
                });
              }
            })
        );
      });
      return Promise.all(scanningPointsPromiseList);
    })
    .then(function(){
      //make some cleanups...
      Utils.log('warn',"Cleanup pokemon lists.");
      configs.nearByPokemons = _.uniqBy(configs.nearByPokemons,'id');
      Utils.log('info',configs.nearByPokemons.length + " total pokemons found.");
      Utils.log('warn',"Generating a html file...");
      var createHtmlPromise = Utils.createWebPage(configs.location,configs.nearByPokemons,configs.GOOGLE_MAP_API);
      return createHtmlPromise;
    })
    .then(function(result){
      Utils.log('info',"======================");
      Utils.log('info',result.message);
    })
    .finally(function(){
      Utils.log('info',"Done.");
    })
    .catch(function(e) {
      console.log(e.message);
    });
  }else{
    Utils.log('error',"Login method not supported yet! "+program.method);
    process.exit(1);
  }
}

program
  .version('1.0.0')
  .description('Pokemon GO Map')
  .option('-U, --username <username>', 'google user account')
  .option('-P, --password <password>', 'password')
  .option('-L, --location <location>', 'location',"Stockholm,Sweden")
  .option('-M, --method <method>', 'login method','google')
  .option('-R, --radiation', 'scanning points')
  .parse(process.argv);

if (!program.username || !program.password) {
  program.help();
}else{
  dataProcess();
}
