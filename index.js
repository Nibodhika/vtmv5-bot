// Import a config file to set the token
var config = require('./config.json');

var bot = require('./bot')(config);

if(config.web){
    var Server = require('./web') //(config);
    var port = config.port || 8081
    var server = Server.listen(port, function(){
        console.log('Server listening on port %d ',
                    server.address().port);
    });
}
