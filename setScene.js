var Winky = require('./Winky.js');

var clientId      = process.env.WINK_CLIENT_ID,
    clientSecret  = process.env.WINK_CLIENT_SECRET,
    username      = process.env.WINK_USERNAME,
    password      = process.env.WINK_PASSWORD;

var winky = new Winky();

var setSceneName = process.argv[2];
var sceneToSet = null;

winky.login(clientId,clientSecret,username,password,function(err,data){
	winky.getScenes(function(err,scenes){
		scenes.forEach(function(scene){
			if(scene.name == setSceneName){
				sceneToSet = scene;
			}
		});
		if(sceneToSet){
			winky.setScene(sceneToSet);
		}else{
			console.log('Scene does not exist');
		}
	});
});

