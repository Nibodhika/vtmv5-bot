var express = require('express');
var router = express.Router();

var rules = require('../../rules')
var Character = require('../../models/character')

// var filters = require('pug').filters
// filters.my_test = function (text, options) {
//     if (options.addStart) text = 'Start\n' + text;
//     if (options.addEnd)   text = text + '\nEnd';
//     return text;
// }


router.get('/', function(req, res, next) {
    var characters = Character.all()
    res.send(characters)
    return
    if(req.session.user.is_gm){
        var characters = Character.all()
        res.send(characters)
        
        // var character_list = []
        // for(var i in characters){
        //     var chara = characters[i]
        //     character_list.push({text:chara.name, url: req.originalUrl + chara.id})
        // }

        
        // res.render('list_characters', {character_list:character_list});
    }
    else{
        res.send(character)
        // res.render('character', {character: req.session.user.character});
    }
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id
    var character = req.session.user.character
    // Only GM can load other characters sheet
    if(req.session.user.is_gm){
        character = Character.get(id)    
    }

    var arst = function(name){ return name + ": " + character[name] }
    var larst = function(r1,r2,r3){ return [arst(r1), arst(r2), arst(r3)]}

    var skills = character.get_skills()
    var skill_table = []
    function as_lists(dict){
        var keys = []
        var values = []
        for(var key in dict){
            keys.push(key)
            values.push(dict[key])
        }
        return [keys,values]
    }
    // Convert the dict to lists
    var physical = as_lists(skills.physical)
    var social = as_lists(skills.social)
    var mental = as_lists(skills.mental)
    // Get max length
    max_length = physical[0].length
    if(social[0].length > max_length)
        max_length = social[0].length
    if(mental[0].length > max_length)
        max_length = mental[0].length
        
    for(var i = 0; i < max_length; i++){
        var p = physical[0][i] || ""
        var s = social[0][i] || ""
        var m = mental[0][i] || ""
        line = larst(p,s,m)
        skill_table.push(line)
    }

    //Disciplines
    var disciplines_table = []
    for(var discipline in rules.disciplines){
        var disciplines_line = []
        if(character[discipline] > 0){
            var line = arst(discipline)
            if(disciplines_line.length > 3){
                disciplines_table.push(disciplines_line)
                disciplines_line = []
            }
            disciplines_line.push(line)
        }
    }
    disciplines_table.push(disciplines_line)

    //Advantages
    var advantages_table = []
    for(var adv in character.advantages){
        var advantage = character.advantages[adv]
        advantages_table.push([
            adv,
            advantage.points,
            advantage.specification
        ])
    }

    // Thin Blood advantages
    var tb_advantages_table = []
    for(var adv in character.thin_blood_adv){
        var advantage = character.thin_blood_adv[adv]
        tb_advantages_table.push([
            adv,
            advantage
        ])
    }

    
    res.render('character',
               {
                   character: character,
                   arst: arst,
                   larst: larst,
                   skill_table:skill_table,
                   disciplines_table: disciplines_table,
                   advantages_table: advantages_table,
                   tb_advantages_table:tb_advantages_table
               });
});

module.exports = router;
