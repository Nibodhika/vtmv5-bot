var path = require('path');

var database = require('../database');

module.exports = function(app){

    app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname + '/../templates/login.html'));
    });

    app.get('/logout', function(req, res) {
        delete req.session.user;
        res.sendStatus(200);
    });

    app.post('/auth', function(req, res){
        var username = req.body.username;
        var password = req.body.password;
        var user = database.user.authenticate(username, password);
        if(user != undefined){
            req.session.user = user
            res.sendStatus(200);
        }
        else{
            res.sendStatus(403);
        }

    });
    
}
