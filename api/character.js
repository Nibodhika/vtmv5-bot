var Character = require('../models/character')

var base = require('./base')
var check_login = base.check_login

module.exports = function(app){

    app.get('/character/:id', function(req, res){
        if(check_login(req,res)){
            var id = req.params.id;
            var character = Character.get(id);
            res.send(character)
        }
    });
    
    app.get('/characters', function(req, res){
        if(check_login(req,res)){
            var characters = Character.all();
            res.send(characters)    
        }
        
    });
    
};

    
