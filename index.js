var request       = require('request');

var apiUrl        = 'https://winkapi.quirky.com',
    devices       = [], //all devices under your Wink acount
    oauth2;             //oauth2 object containing API token

var clientId      = process.env.WINK_CLIENT_ID,
    clientSecret  = process.env.WINK_CLIENT_SECRET,
    username      = process.env.WINK_USERNAME,
    password      = process.env.WINK_PASSWORD;


function login(){
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
      oauth2 = body.data;
      getDevices();
  })
}

function getDevices(){
  request({
    url     : apiUrl+'/users/me/wink_devices',
    method  : 'GET',
    json    : true,
    headers : {
      'Authorization' : 'Bearer '+oauth2.access_token,
      'Content-Type'  : 'application/json',
    }
  }, function response(err, httpResponse, body){
      devices = body.data.map(function(device){
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

    //turnOffAll();
    //turnOnAll();
    //dimAll(0);
    dimAll(1);

  })
}

function turnOnAll(){
  devices.forEach(function(device){
    if(device.type == 'light_bulb'){
      setDeviceState(device,true,1);
    }
  });
}

function turnOffAll(){
  devices.forEach(function(device){
    if(device.type == 'light_bulb'){
      setDeviceState(device,false,1);
    }
  });
}

function dimAll(dimValue){
  devices.forEach(function(device){
    if(device.type == 'light_bulb'){
      setDeviceState(device,true,dimValue);
    }
  });  
}

function setDeviceState(device,powered,brightness){
  request({
    url     : apiUrl+'/'+device.type+'s/'+device.id,
    method  : 'PUT',
    json    : true,
    headers : {
      'Authorization' : 'Bearer ' + oauth2.access_token,
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

login();
