var step = require('./steps')
var rules = require('../../rules')

module.exports.PREDATOR = function(character,content,who){
    var predator_types = Object.keys(rules.predator_type)

    if(predator_types.indexOf(content) > -1){
        character.predator = content;
        character.save()
        return [step.PREDATOR_CHARACTERISTIC_1];
    }
    return [step.PREDATOR,
            content + " is not a valid predator type, choose one from the list above"]
}


function ALLEYCAT_1(character,content,who){
    var accepted_specilities = ['intimidation stickups','brawl grappling']
    if(accepted_specilities.indexOf(content) > -1){
        var args = content.split(' ')
        character.add_speciality(args[0], args[1])
        return [step.PREDATOR_CHARACTERISTIC_2]
    }
    return [step.PREDATOR_CHARACTERISTIC_1,
            `Please select one of the specialities listed before`]
}
function ALLEYCAT_2(character,content,who){
    var accepted_disciplines = ['celerity','potence']
    if( accepted_disciplines.indexOf(content) > -1){
        character[content] = character[content] + 1
        return [step.PREDATOR_CHARACTERISTIC_3]
    }
    return [step.PREDATOR_CHARACTERISTIC_2,
            `Please select one of the disciplines listed before`]
}

function ALLEYCAT_3(character,content,who){
    // TODO add the chosen power to the discipline
    character.humanity = character.humanity -1
    // TODO add 3 dots of criminal contacts
    return [step.ADVANTAGES_MERIT]
}
// var ALLEYCAT = [ALLEYCAT_1,ALLEYCAT_2,ALLEYCAT_3,ALLEYCAT_4]


module.exports.PREDATOR_CHARACTERISTIC_1 = function(character,content,who){
    if(character.predator == 'alleycat'){
        return ALLEYCAT_1(character,content,who)
    }
}
module.exports.PREDATOR_CHARACTERISTIC_2 = function(character,content,who){
    if(character.predator == 'alleycat'){
        return ALLEYCAT_2(character,content,who)
    }
}
module.exports.PREDATOR_CHARACTERISTIC_3 = function(character,content,who){
    if(character.predator == 'alleycat'){
        return ALLEYCAT_3(character,content,who)
    }
}
module.exports.PREDATOR_CHARACTERISTIC_4 = function(character,content,who){
    if(character.predator == 'alleycat'){
    }
}
module.exports.PREDATOR_CHARACTERISTIC_5 = function(character,content,who){
    if(character.predator == 'alleycat'){
    }
}
module.exports.PREDATOR_CHARACTERISTIC_6 = function(character,content,who){
    if(character.predator == 'alleycat'){
    }    
}
