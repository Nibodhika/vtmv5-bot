var step = require('./steps.js')
var helpers = require('./helpers')
var specialty_step = helpers.specialty_step
var discipline_step = helpers.discipline_step
var Character = require('../../character')

function SPECIALTY_ACADEMICS(character,content,who){
    character.add_specialty('academics', content)
    var next_step = specialty_step(character, step.SPECIALTY_CRAFT)
    return [next_step]
}
function SPECIALTY_CRAFT(character,content,who){
    character.add_specialty('craft', content)
    var next_step = specialty_step(character, step.SPECIALTY_PERFORMANCE)
    return [next_step]
}
function SPECIALTY_PERFORMANCE(character,content,who){
    character.add_specialty('performance', content)
    var next_step = specialty_step(character, step.SPECIALTY_SCIENCE)
    return [next_step]
}
function SPECIALTY_SCIENCE(character,content,who){
    character.add_specialty('science', content)
    return [step.SPECIALTY]
}
function SPECIALTY(character,content,who){
    var args = content.split(' ')
    if(args.length < 2){
        return [step.SPECIALTY,
               'You need to specify a skill and then a specialty, e.g. melee knifes']
    }
    var skill = args[0]
    var specialty = content.substring(args[0].length + 1)

    var meant = Character.unalias_skill(skill)
    if(meant === undefined)
        return [step.SPECIALTY,
               `Unknown skill ${skill}`]

    if(character.sheet[meant] == 0){
        return [step.SPECIALTY,
               `character has 0 points in ${meant}, choose a specialty for a skill he has at least one point`]
    }
    
    character.add_specialty(meant, specialty)

    return [discipline_step(character)]
}


module.exports.SPECIALTY_ACADEMICS = SPECIALTY_ACADEMICS
module.exports.SPECIALTY_CRAFT = SPECIALTY_CRAFT
module.exports.SPECIALTY_PERFORMANCE = SPECIALTY_PERFORMANCE
module.exports.SPECIALTY_SCIENCE = SPECIALTY_SCIENCE
module.exports.SPECIALTY = SPECIALTY
