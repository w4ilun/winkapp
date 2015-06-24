var Winky = require('./Winky.js');

var clientId      = process.env.WINK_CLIENT_ID,
    clientSecret  = process.env.WINK_CLIENT_SECRET,
    username      = process.env.WINK_USERNAME,
    password      = process.env.WINK_PASSWORD;

var winky = new Winky();

winky.login(clientId,clientSecret,username,password,function(err,data){
  winky.getDevices(function(err,devices){
    console.log(winky.devices);
  });
});

