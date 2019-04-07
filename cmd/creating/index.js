var database = require('../../database')
var rules = require('../../rules')
var Character = require('../../character.js')

var step = require('./steps')
var first_steps = require('./first_steps')

var attributes = require('./attributes')
var skills = require('./skills')
var speciality = require('./speciality')
var disciplines = require('./disciplines')
var predator = require('./predator')
var advantages = require('./advantages')
var thin_blood_adv = require('./thin_blood_adv')
var convictions = require('./convictions')

var step_msg = require('./step_msg')

function FINISH(msg){
    msg.author.send("finished creation");
    return step.BEFORE;
}

module.exports = function creating_cmd(msg, begin_creation){
    var who = msg.author;
    var current_step = -1;
    if(begin_creation){
        database.creation.set_step(who,0)
        current_step = 0;
    }
    else{
        current_step = database.creation.get_step(who)
    }

    current_step = do_create(msg, current_step)
    database.creation.set_step(who, current_step)
}

function do_create(msg, current_step) {
    var character = Character.find(msg.author);
    var content = msg.content.toLowerCase()
    var who = msg.author

    var out = []
    switch(current_step){
    case step.WELCOME:
        out = first_steps.WELCOME(character,content,who);
        break;
    case step.DELETE_CHARACTER:
        out = first_steps.DELETE_CHARACTER(character,content,who);
        break;
    case step.NAME:
        // Name needs to not be lowercased
        out = first_steps.NAME(character,msg.content,who);
        break;
    case step.CONCEPT:
        // Concept needs to not be lowercased
        out = first_steps.CONCEPT(character,msg.content,who);
        break;
    case step.CLAN:
        out = first_steps.CLAN(character,content,who);
        break;

    case step.ATTRIBUTE_4:
        out = attributes.ATTRIBUTE_4(character,content,who);
        break;
    case step.ATTRIBUTE_3:
        out = attributes.ATTRIBUTE_3(character,content,who);
        break;
    case step.ATTRIBUTE_2:
        out = attributes.ATTRIBUTE_2(character,content,who);
        break;

    case step.SKILL_DISTRIBUTION:
        out = skills.SKILL_DISTRIBUTION(character,content,who);
        break;

    case step.JACK_3:
        out = skills.JACK_3(character,content,who);
        break;
    case step.JACK_2:
        out = skills.JACK_2(character,content,who);
        break;
    case step.JACK_1:
        out = skills.JACK_1(character,content,who);
        break;

    case step.BALANCED_3:
        out = skills.BALANCED_3(character,content,who);
        break;
    case step.BALANCED_2:
        out = skills.BALANCED_2(character,content,who);
        break;
    case step.BALANCED_1:
        out = skills.BALANCED_1(character,content,who);
        break;

    case step.SPECIALIST_4:
        out = skills.SPECIALIST_4(character,content,who);
        break;
    case step.SPECIALIST_3:
        out = skills.SPECIALIST_3(character,content,who);
        break;
    case step.SPECIALIST_2:
        out = skills.SPECIALIST_2(character,content,who);
        break;
    case step.SPECIALIST_1:
        out = skills.SPECIALIST_1(character,content,who);
        break;

    case step.SPECIALITY_ACADEMICS:
        out = speciality.SPECIALITY_ACADEMICS(character,content,who);
        break;
    case step.SPECIALITY_CRAFT:
        out = speciality.SPECIALITY_CRAFT(character,content,who);
        break;
    case step.SPECIALITY_PERFORMANCE:
        out = speciality.SPECIALITY_PERFORMANCE(character,content,who);
        break;
    case step.SPECIALITY_SCIENCE:
        out = speciality.SPECIALITY_SCIENCE(character,content,who);
        break;
    case step.SPECIALITY:
        out = speciality.SPECIALITY(character,content,who);
        break;

    case step.DISCIPLINES_2:
        out = disciplines.DISCIPLINES_2(character,content,who);
        break;
    case step.DISCIPLINES_1:
        out = disciplines.DISCIPLINES_1(character,content,who);
        break;
        
    case step.PREDATOR:
        out = predator.PREDATOR(character,content,who);
        break;

    case step.PREDATOR_CHARACTERISTIC_1:
        out = predator.PREDATOR_CHARACTERISTIC_1(character,content,who);
        break;
    case step.PREDATOR_CHARACTERISTIC_2:
        out = predator.PREDATOR_CHARACTERISTIC_2(character,content,who);
        break;
    case step.PREDATOR_CHARACTERISTIC_3:
        out = predator.PREDATOR_CHARACTERISTIC_3(character,content,who);
        break;
    case step.PREDATOR_CHARACTERISTIC_4:
        out = predator.PREDATOR_CHARACTERISTIC_4(character,content,who);
        break;

    case step.ADVANTAGES_MERIT:
        out = advantages.ADVANTAGES_MERIT(character,content,who);
        break
    case step.ADVANTAGES_MERIT_CONFIRM_UNSPENT:
        out = advantages.ADVANTAGES_MERIT_CONFIRM_UNSPENT(character,content,who);
        break
    case step.ADVANTAGES_FLAWS:
        out = advantages.ADVANTAGES_FLAWS(character,content,who);
        break
    case step.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT:
        out = advantages.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT(character,content,who);
        break

    case step.THIN_BLOOD_MERITS:
        out = thin_blood_adv.THIN_BLOOD_MERITS(character,content,who);
        break
    case step.THIN_BLOOD_FLAWS:
        out = thin_blood_adv.THIN_BLOOD_FLAWS(character,content,who);
        break

    case step.CONVICTIONS_TOUCHSTONES:
        out = convictions.CONVICTIONS_TOUCHSTONES(character,content,who);
        break
        
    default:
        out = [step.BEFORE,
               "It seems you are not creating a character yet, first send the !create command"];
    }

    // We only got a step, pick the default message for that step
    if(out.length == 1){
        // Reload the character, as something that is needed for the msg might have changed
        character = Character.find(msg.author);
        var reply = step_msg(out[0], character)
        out.push(reply)
    }
        

    // console.log("out of the check got: " + out[0] + "\n" + out[1])
    msg.author.send(out[1])
    return out[0]
}
