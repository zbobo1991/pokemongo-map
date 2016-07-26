'use strict';

var Promise = require('bluebird');
var GoogleAuth = require('gpsoauthnode');

//definitions
const OAUTH_SERVICE = 'audience:server:client_id:848232511240-7so421jotr2609rmqakceuu1luuq0ptb.apps.googleusercontent.com';
const APP_ID = 'com.nianticlabs.pokemongo';
const CLIENT_SIGNATURE = '321187995bc7cdc2b5fc91b11a96e2baa8602c62';
const DEVICE_ID = "9774d56d682e549c";

var loginInterface = {

  googleAuth: function(username,password){
    return new Promise(function(resolve, reject) {
        var googleAuth = new GoogleAuth();
        //throw-safe.
        googleAuth.login(username, password, DEVICE_ID, function(e, data) {
          if(e){
            return reject(e);
          }

          //get oauth token
          googleAuth.oauth(username, data.masterToken, data.androidId, OAUTH_SERVICE, APP_ID, CLIENT_SIGNATURE, function(e, data) {
            if(e){
              return reject(e);
            }

            resolve(data.Auth);
          });
        });
    });
  }

};

module.exports = loginInterface;
