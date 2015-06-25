var UI = require('ui');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Winky',
  subtitle: 'Wink Lights',
  body: 'Press Select to Toggle.'
});

main.show();

main.on('click', 'select', function(e) {
  ajax({
      url: 'http://192.168.1.22:3001?command=toggle', //replace with your home server URL, I am using express.js
      method: 'post'
    },
    function(data) {},
    function(error) {}
  );
});
