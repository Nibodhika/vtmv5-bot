var step = require('./steps')

var helpers = require('./helpers')
var set_skills = helpers.set_skills
var skill_distributions = helpers.skill_distributions
var speciality_step = helpers.speciality_step

function SKILL_DISTRIBUTION(character,content,who){
    if(skill_distributions.indexOf(content) > -1){
        if(content == 'jack of all trades')
            return [step.JACK_3];
        else if(content == 'balanced')
            return [step.BALANCED_3];
        else if(content == 'specialist')
            return [step.SPECIALIST_4];
        
        return [step.BEFORE, "Please report that "+content+" is not valid"]
    }

    return [step.SKILL_DISTRIBUTION,
            content + " is not a valid skill distribution, please select one from the list above"]
}

function JACK_3(character,content,who){
    // 1 skill at 3
    return set_skills(
        character,
        content,
        1,
        3,
        step.JACK_3,
        step.JACK_2
    );
}
function JACK_2(character,content,who){
    // 8 at 2
    return set_skills(
        character,
        content,
        8,
        2,
        step.JACK_2,
        step.JACK_1
    );
}

function JACK_1(character,content,who){
    // 10 at 1
    return set_skills(
        character,
        content,
        10,
        1,
        step.JACK_1,
        speciality_step(character)
    );
}


function BALANCED_3(character,content,who){
    // 3 at 3
    return set_skills(
        character,
        content,
        3,
        3,
        step.BALANCED_3,
        step.BALANCED_2,
    );
}
function BALANCED_2(character,content,who){
    // 5 at 2
    return set_skills(
        character,
        content,
        5,
        2,
        step.BALANCED_2,
        step.BALANCED_1
    );
}
function BALANCED_1(character,content,who){
    // 7 at 1
    return set_skills(
        character,
        content,
        7,
        1,
        step.BALANCED_1,
        speciality_step(character)
    );
}


function SPECIALIST_4(character,content,who){
    // 1 at 4
    return set_skills(
        character,
        content,
        1,
        4,
        step.SPECIALIST_4,
        step.SPECIALIST_3
    );
}
function SPECIALIST_3(character,content,who){
    // 3 at 3
    return set_skills(
        character,
        content,
        3,
        3,
        step.SPECIALIST_3,
        step.SPECIALIST_2
    );
}
function SPECIALIST_2(character,content,who){
    // 3 at 2
    return set_skills(
        character,
        content,
        3,
        2,
        step.SPECIALIST_2,
        step.SPECIALIST_1
    );
}
function SPECIALIST_1(character,content,who){
    // 3 at 1
    return set_skills(
        character,
        content,
        3,
        1,
        step.SPECIALIST_1,
        speciality_step(character)
    );
}

module.exports.SKILL_DISTRIBUTION = SKILL_DISTRIBUTION
module.exports.JACK_3 = JACK_3
module.exports.JACK_2 = JACK_2
module.exports.JACK_1 = JACK_1
module.exports.BALANCED_3 = BALANCED_3
module.exports.BALANCED_2 = BALANCED_2
module.exports.BALANCED_1 = BALANCED_1
module.exports.SPECIALIST_4 = SPECIALIST_4
module.exports.SPECIALIST_3 = SPECIALIST_3
module.exports.SPECIALIST_2 = SPECIALIST_2
module.exports.SPECIALIST_1 = SPECIALIST_1
