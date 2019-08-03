// Import a config file to set the token
var config = require('./config.json');

var bot = require('./bot')(config);

if(config.web){
    var Server = require('./web')(config);
}
