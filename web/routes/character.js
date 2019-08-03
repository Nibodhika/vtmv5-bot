var express = require('express');
var router = express.Router();

var Character = require('../../models/character')


router.get('/', function(req, res, next) {
    res.render('character', {character: req.session.user.character});
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id
    var character = req.session.user.character
    // Only GM can load other characters sheet
    if(req.session.user.is_gm){
        character = Character.get(id)    
    }

    res.render('character', {character: req.session.user.character});
});

module.exports = router;
