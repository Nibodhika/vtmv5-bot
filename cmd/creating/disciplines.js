var step = require('./steps')
var helpers = require('./helpers')

function set_discipline(character, content, next_step, current_step, value){
    var available_disciplines = helpers.build_character_discipline_list(character)
    if(available_disciplines.indexOf(content) > -1){
        var current_value = character.sheet[content]
        if(current_value != 0){
            return [current_step,
                    `You already chose that discipline to have ${current_value} dots` ]
        }
        character.sheet[content] = value;
        character.save();
        return [next_step]
    }
    var reply = content + " is not a valid discipline for your character at creation, please select one from the list above"
    return [current_step,reply]
}

module.exports.DISCIPLINES_2 = function(character, content, who){
    return set_discipline(character,
                          content,
                          step.DISCIPLINES_1,
                          step.DISCIPLINES_2,
                          2,
                         )
}

module.exports.DISCIPLINES_1 = function(character, content, who){
    return set_discipline(character,
                          content,
                          step.PREDATOR,
                          step.DISCIPLINES_1,
                          2,
                         )
}
