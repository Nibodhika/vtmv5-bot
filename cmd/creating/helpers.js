var step = require('./steps.js')
var Character = require('../../models/character')
var rules = require('../../rules')

function base_set(
    character,    // Character to apply the changes
    content,      // content of the message sent
    amount,       // amount of attributes to change
    value,        // value to put in those attributes
    current_step, // The current step where this function was called from
    next_step,    // The step this function should return if everything went accordingly
    is_attribute, // bool value, if true attribute, otherwise skill
){
    var name = 'skill'
    var unset_value = 0
    var unalias_function = Character.unalias_skill
    if(is_attribute){
        name = 'attribute'
        unset_value = 1
        unalias_function = Character.unalias_attr
    }

    // Get rid of spaces and split by ,
    var attr_list = content.replace('\s+/g', '').split(',');
    if(attr_list.length != amount){
        return [current_step,
                `Please select exactly ${amount} ${name}s`]
    }

    for(var i=0; i<attr_list.length; i++){
        var said = attr_list[i];
        var meant = unalias_function(said);
        // Could not find the attribute
        if(meant == undefined)
            return[current_step,
                   `${said} is not a valid ${name}`]
        // Attribute has already been set
        if(character.sheet[meant] != unset_value)
            return [ current_step,
                     `${meant} has already been chosen to have ${character.sheet[meant]} dots`]
        // actually apply the changes
        // use set with save set to false to update values of related attributes
        character.set(meant, value,false);
    }

    // Only save after all attributes have been changed
    character.save();
    return[next_step]
}

function set_attributes(
    character,    // Character to apply the changes
    content,      // content of the message sent
    amount,       // amount of attributes to change
    value,        // value to put in those attributes
    current_step, // The current step where this function was called from
    next_step,    // The step this function should return if everything went accordingly
){
    return base_set(
        character,
        content,
        amount,
        value,
        current_step,
        next_step,
        true
    )
}

function set_skills(
    character,    // Character to apply the changes
    content,      // content of the message sent
    amount,       // amount of attributes to change
    value,        // value to put in those attributes
    current_step, // The current step where this function was called from
    next_step,    // The step this function should return if everything went accordingly
){
    return base_set(
        character,
        content,
        amount,
        value,
        current_step,
        next_step,
        false
    )
}

function build_character_discipline_list(character){
    // Creates the list of disciplines for a character
    // Thin blood have no available disciplines at creation
    // Caitiff can choose from any discipline (except thin blood alchemy) at creation
    // Other clans have a set of disciplines they can choose
    var disciplines = []
    if(character.sheet.clan == 'thin_blood'){
    }    
    else if(character.sheet.clan == 'caitiff'){
        for(var discipline in rules.disciplines){
            if(['thin_blood_alchemy', 'blood_sorcery'].indexOf(discipline) == -1)
                disciplines.push(discipline)
        }
    }
    else{
        for(var i in rules.clans[character.sheet.clan].disciplines)
            disciplines.push(rules.clans[character.sheet.clan].disciplines[i])
    }
    return disciplines
}

module.exports.skill_distributions = [
    'jack of all trades',
    'balanced',
    'specialist',
]

function specialty_step(character, next_step=step.SPECIALTY_ACADEMICS){

    if(next_step == step.SPECIALTY_ACADEMICS){
        if(character.sheet.academics == 0)
            return specialty_step(character, step.SPECIALTY_CRAFT)
    }
    else if(next_step == step.SPECIALTY_CRAFT){
        if(character.sheet.craft == 0)
            return specialty_step(character, step.SPECIALTY_PERFORMANCE)
    }
    else if(next_step == step.SPECIALTY_PERFORMANCE){
        if(character.sheet.performance == 0)
            return specialty_step(character, step.SPECIALTY_SCIENCE)
    }
    else if(next_step == step.SPECIALTY_SCIENCE){
        if(character.sheet.science == 0)
            return step.SPECIALTY
    }

    return next_step
}

function discipline_step(character){
    //Returns the first discipline step if the character has it, otherwise the next step
    if(character.sheet.clan == 'thin_blood'){
        // Thin blood don't have either disciplines nor predator type
        return step.ADVANTAGES_MERIT
    }
    return step.DISCIPLINES_2
}

function y_n_question(content, on_yes, on_no, current_step){
    if(['y', 'yes'].indexOf(content) > -1){
        return on_yes()
    }
    else if(['n', 'no'].indexOf(content) > -1){
        return on_no()
    }

    return [
        current_step,
        content + " is not a valid response"
    ]
}

module.exports.set_attributes = set_attributes
module.exports.set_skills = set_skills
module.exports.build_character_discipline_list = build_character_discipline_list
module.exports.specialty_step = specialty_step
module.exports.discipline_step = discipline_step
module.exports.y_n_question = y_n_question
