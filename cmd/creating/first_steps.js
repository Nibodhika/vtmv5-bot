var step = require('./steps')
const rules = require('../../rules');
var Character = require('../../models/character')
var y_n_question = require('./helpers').y_n_question

function WELCOME(character, content, who) {
    if(character === undefined) {
        return [step.NAME]
    }
    return [step.DELETE_CHARACTER];
}

function DELETE_CHARACTER(character, content, who){
    return y_n_question(content,
                        () => {
                            character.delete_from_database()
                            return [step.NAME]
                        },
                        () => {
                            return [step.BEFORE, "Aborting character creation"]
                        },
                 step.DELETE_CHARACTER
                )
}

function NAME(character, content, who){
    character = new Character(content, who);
    character.save();
    return [step.CONCEPT];
}

function CONCEPT(character, content, who){
    character.concept = content;
    character.save();
    return [step.CLAN];
}

function CLAN(character, content, who){
    if(Object.keys(rules.clans).indexOf(content) > -1){
        character.clan = content;
        if(content == 'thin_blood')
            character.generation = 14
        character.save();
        return [step.ATTRIBUTE_4]
    }
    
    return [step.CLAN,
            'Unknown clan, select one from the list before'];
}

module.exports.WELCOME = WELCOME
module.exports.DELETE_CHARACTER = DELETE_CHARACTER
module.exports.NAME = NAME
module.exports.CONCEPT = CONCEPT
module.exports.CLAN = CLAN
