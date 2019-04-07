var step = require('./steps.js')
var helpers = require('./helpers')
var speciality_step = helpers.speciality_step
var discipline_step = helpers.discipline_step
var Character = require('../../character')

function SPECIALITY_ACADEMICS(character,content,who){
    character.add_speciality('academics', content)
    var next_step = speciality_step(character, step.SPECIALITY_CRAFT)
    return [next_step]
}
function SPECIALITY_CRAFT(character,content,who){
    character.add_speciality('craft', content)
    var next_step = speciality_step(character, step.SPECIALITY_PERFORMANCE)
    return [next_step]
}
function SPECIALITY_PERFORMANCE(character,content,who){
    character.add_speciality('performance', content)
    var next_step = speciality_step(character, step.SPECIALITY_SCIENCE)
    return [next_step]
}
function SPECIALITY_SCIENCE(character,content,who){
    character.add_speciality('science', content)
    return [step.SPECIALITY]
}
function SPECIALITY(character,content,who){
    var args = content.split(' ')
    if(args.length < 2){
        return [step.SPECIALITY,
               'You need to specify a skill and then a speciality, e.g. melee knifes']
    }
    var skill = args[0]
    var speciality = content.substring(args[0].length + 1)

    var meant = Character.unalias_skill(skill)
    if(meant === undefined)
        return [step.SPECIALITY,
               `Unknown skill ${skill}`]

    if(character.sheet[meant] == 0){
        return [step.SPECIALITY,
               `character has 0 points in ${meant}, choose a speciality for a skill he has at least one point`]
    }
    
    character.add_speciality(meant, speciality)

    return [discipline_step(character)]
}


module.exports.SPECIALITY_ACADEMICS = SPECIALITY_ACADEMICS
module.exports.SPECIALITY_CRAFT = SPECIALITY_CRAFT
module.exports.SPECIALITY_PERFORMANCE = SPECIALITY_PERFORMANCE
module.exports.SPECIALITY_SCIENCE = SPECIALITY_SCIENCE
module.exports.SPECIALITY = SPECIALITY
