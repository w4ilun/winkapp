var Winky = require('./Winky.js');
var winky = new Winky();
var noble = require('noble');
var adName = 'iTAG';
var scenes;
var state = 'OFF';

noble.on('stateChange', function(state){
	if(state === 'poweredOn'){
		noble.startScanning();
	}else{
		noble.stopScanning();
	}
});

noble.on('discover', function(peripheral){
	if(peripheral.advertisement.localName == adName){
		noble.stopScanning();
		console.log('iTAG found!');
		connect(peripheral);
		peripheral.once('disconnect', function(){
			console.log('Disconnected...Start Scanning...');
			noble.startScanning();
		});
	}
});

function connect(peripheral){
	peripheral.connect(function(err){
		if(err){
			console.log(err);
		}else{
			console.log('iTAG connected!');
		}
		peripheral.discoverServices([], function(err, services){
			services.forEach(function(service){
				if(service.uuid == 'ffe0'){
					service.discoverCharacteristics([], function(error, characteristics){
						characteristics.forEach(function(characteristic){
							if(characteristic.uuid == 'ffe1'){
								characteristic.subscribe(function(err){
									characteristic.on('data', function(data){
										console.log('Triggered');
										toggleLights();
									});
								});
							}
						});
					});
				}
			});
		});
	});
}

function toggleLights(){
	if(state == 'OFF'){
		scenes.forEach(function(scene){
			if(scene.name == 'ON'){
				winky.setScene(scene);
				state = 'ON';
				console.log('Turned ON');
			}
		});
		return;
	}
	if(state == 'ON'){
		scenes.forEach(function(scene){
			if(scene.name == 'OFF'){
				winky.setScene(scene);
				state = 'OFF';
				console.log('Turned OFF');
			}
		});
		return;
	}	
}

function getScenes(){

	var clientId      = '',
	    clientSecret  = '',
	    username      = '',
	    password      = '';

	winky.login(clientId,clientSecret,username,password,function(err,data){
		if(err){
			console.log(err);
		}
		winky.getScenes(function(err,data){
			scenes = data;
		});
	});

}

getScenes();