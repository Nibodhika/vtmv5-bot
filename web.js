var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')

var Api = require('./api')

module.exports = function(config){
    
    var app = express();
    keys = config.keys || ['atohns9*HST;8HSAKT:(*HAsttktyhth8$hOn$na']
    app.use(cookieSession({
        name: 'session',
        keys: keys,
        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }))

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", ["OPTIONS", "GET", "POST", "DELETE", "PUT"]);
        next();
    });

    // Initialize API
    Api(app)

    //  Start the app on the specific interface (and port).
    port = config.port || 8081;
    var server = app.listen(port, function () {
        console.log('Server listening on port %d ',
                    server.address().port);
    });

    return app
}
