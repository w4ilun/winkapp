var WinkAPI = require('node-winkapi');
var clientID     = process.env.WINK_CLIENT_ID
  , clientSecret = process.env.WINK_CLIENT_SECRET
  , userName     = process.env.WINK_USERNAME
  , passPhrase   = process.env.WINK_PASSWORD
  , winkapi;

winkapi = new WinkAPI.WinkAPI({ clientID     : clientID
                              , clientSecret : clientSecret }).login(userName, passPhrase, function(err) {
  if (!!err) return console.log('login error: ' + err.message);

  // otherwise, good to go!

	winkapi.getDevices(function(err, devices) {
	  if (!!err) return console.log('getDevices: ' + err.message);

	  console.log(devices);
	});


}).on('error', function(err) {
  console.log('background error: ' + err.message);
});