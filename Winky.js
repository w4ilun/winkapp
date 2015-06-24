var request       = require('request');

var apiUrl        = 'https://winkapi.quirky.com';

var Winky         = function(){
  this.devices    = [];   //all devices under your Wink acount
  this.oauth2     = null; //oauth2 object containing API token
};

Winky.prototype.login         = login;
Winky.prototype.getDevices    = getDevices;
Winky.prototype.setDevice     = setDevice;/*
Winky.prototype.getGroups     = getGroups;
Winky.prototype.setGroup      = setGroup;
Winky.prototype.getScenes     = getGroups;
Winky.prototype.activateScene = setGroup;*/

function login(clientId,clientSecret,username,password,cb){

  var self = this;

  request({
    url     : apiUrl+'/oauth2/token',
    method  : 'POST',
    json    : true,
    headers : {
      'Content-Type': 'application/json'
    },
    body    : {
      client_id     : clientId,
      client_secret : clientSecret,
      username      : username,
      password      : password,
      grant_type    : 'password'
    }
  }, function response(err, httpResponse, body){
      if(!!err){
        cb(err,null);
        return;
      }
      if(body.data.error){
        cb(new Error(body.data.error_description),null);
        return;
      }
      self.oauth2 = body.data;
      cb(null,body.data);
  })
}

function getDevices(cb){

  var self = this;

  request({
    url     : apiUrl+'/users/me/wink_devices',
    method  : 'GET',
    json    : true,
    headers : {
      'Authorization' : 'Bearer '+self.oauth2.access_token,
      'Content-Type'  : 'application/json',
    }
  }, function response(err, httpResponse, body){

      if(!!err){
        cb(err,null);
        return;
      }

      self.devices = body.data.map(function(device){
        var deviceType,deviceId;

        switch(device.model_name){
          case 'Quirky Gateway':
            deviceId    = device.hub_id;
            deviceType  = 'hub';
            break;
          case 'GE light bulb':
            deviceId    = device.light_bulb_id;
            deviceType  = 'light_bulb';
            break;          
          default:
            deviceId    = 'unknown';
            deviceType  = 'unknown';
        }

        return {
          id            : deviceId,
          type          : deviceType,
          desired_state : device.desired_state
        }
      });

      cb(null,self.devices);

  });
}

function turnOnAll(){
  devices.forEach(function(device){
    if(device.type == 'light_bulb'){
      setDevice(device,true,1);
    }
  });
}

function turnOffAll(){
  devices.forEach(function(device){
    if(device.type == 'light_bulb'){
      setDevice(device,false,1);
    }
  });
}

function dimAll(dimValue){
  devices.forEach(function(device){
    if(device.type == 'light_bulb'){
      setDevice(device,true,dimValue);
    }
  });  
}

function setDevice(device,powered,brightness){

  var self = this;

  request({
    url     : apiUrl+'/'+device.type+'s/'+device.id,
    method  : 'PUT',
    json    : true,
    headers : {
      'Authorization' : 'Bearer ' + self.oauth2.access_token,
      'Content-Type'  : 'application/json',
    },
    body    : {
      desired_state : {
        powered     : powered,
        brightness  : brightness
      }
    }
  },function response(err, httpResponse, body){
    console.log(body);
  })  
}

module.exports = Winky;
