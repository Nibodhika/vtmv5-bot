var base = require('./base')


module.exports = function(app){

    app.get('/', function(req, res) {
        if(base.check_login(req,res)){
            res.sendStatus(200)
        }
    });
    
    return {
        auth: require('./auth')(app),
        character: require('./character')(app),
    }

}

