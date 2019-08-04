var step = require('./steps')
var set_attributes = require('./helpers').set_attributes


function ATTRIBUTE_4(character,content,who){
    return set_attributes(
        character,
        content,
        1,
        4,
        step.ATTRIBUTE_4,
        step.ATTRIBUTE_3
    )
}
function ATTRIBUTE_3(character,content,who){
    return set_attributes(
        character,
        content,
        3,
        3,
        step.ATTRIBUTE_3,
        step.ATTRIBUTE_2
    );
}
function ATTRIBUTE_2(character,content,who){
    return set_attributes(
        character,
        content,
        4,
        2,
        step.ATTRIBUTE_2,
        step.SKILL_DISTRIBUTION
    );
}

module.exports.ATTRIBUTE_4 = ATTRIBUTE_4
module.exports.ATTRIBUTE_3 = ATTRIBUTE_3
module.exports.ATTRIBUTE_2 = ATTRIBUTE_2
