var step = require('./steps')
var helpers = require('./helpers')
var rules = require('../../rules')

// A function that given the current step (and extra information) returns the message and next step
module.exports = function(current_step, character) {

    switch(current_step) {
    case step.WELCOME:
        break;
    case step.DELETE_CHARACTER:
        return `You already have a character named ${character.sheet.name}, proceeding with this will delete it, do you wish to proceed? y/n`
    case step.NAME:
        return "First tell me what's your character name"
    case step.CONCEPT:
        return `Created character ${character.sheet.name}, you can see his sheet at any point by sending !character
Now, tell me the core concept for him, type a phrase that succinctly describes your character, e.g. "Corrupt Police" or "Coward investigator"`
    case step.CLAN:
        return clan();
    case step.ATTRIBUTE_4:
        return 'Great, now select one attribute to have 4 dots';
    case step.ATTRIBUTE_3:
        return 'Now select 3 attributes separated by coma to have 3 dots, e.g. "strength,stamina,resolve"'
    case step.ATTRIBUTE_2:
        return 'Now select 4 attributes separated by coma to have 2 dots, e.g. "dexterity,charisma,composure,wits"'
    case step.SKILL_DISTRIBUTION:
        return skill_distribution()
    case step.JACK_3:
        return 'Now select 1 skills separated by coma to have 3 dots, e.g. "athletics,brawl,craft,etc..."'
    case step.JACK_2:
        return 'Now select 8 skills separated by coma to have 2 dots, e.g. "athletics,brawl,craft,etc..."'
    case step.JACK_1:
        return 'Now select 10 skills separated by coma to have 1 dots, e.g. "athletics,brawl,craft,etc..."'
    case step.BALANCED_3:
        return 'Now select 3 skills separated by coma to have 3 dots, e.g. "athletics,brawl,craft"'
    case step.BALANCED_2:
        return 'Now select 5 skills separated by coma to have 2 dots, e.g. "athletics,brawl,craft,etc..."'
    case step.BALANCED_1:
        return 'Now select 7 skills separated by coma to have 1 dots, e.g. "athletics,brawl,craft,etc..."'
    case step.SPECIALIST_4:
        return 'Now select 1 skill to have 4 dots, e.g. "technology"'
    case step.SPECIALIST_3:
        return 'Now select 3 skills separated by coma to have 3 dots, e.g. "athletics,brawl,craft"'
    case step.SPECIALIST_2:
        return 'Now select 3 skills separated by coma to have 2 dots, e.g. "athletics,brawl,craft"'
    case step.SPECIALIST_1:
        return 'Now select 3 skills separated by coma to have 1 dots, e.g. "athletics,brawl,craft"'
        //TODO replace these lists with the ones on the rules specialties
    case step.SPECIALTY_ACADEMICS:
        return `Select one free specialty for academics, examples: Architecture, English Literature, History of Art, History (specific Field or Period), Journalism, Philosophy, Research, Teaching, Theology`
    case step.SPECIALTY_CRAFT:
        return `Select one free specialty for craft, examples: Carpentry, Carving, Design, Painting, Sculpting, Sewing, Weaponsmithing`
    case step.SPECIALTY_PERFORMANCE:
        return `Select one free specialty for performance, examples: Comedy, Dance, Drama, Drums, Guitar, Keyboards,vPoetry, Public Speaking, Rap, Singing, Violin, Wind Instruments`
    case step.SPECIALTY_SCIENCE:
        return `Select one free specialty for science, examples:: Astronomy, Biology, Chemistry, Demolitions, Engineering, Genetics, Geology, Mathematics, Physics`
    case step.SPECIALTY:
        return `Select a specialty for a skill, tell me <skill> <specialty>, you can check a list of suggested specialties for a given skill by typing !help <skill>, e.g. medicine first aid`
    case step.DISCIPLINES_2:
        return disciplines_2(character)
    case step.POWER_1:
        return `Pick a level one power for that discipline`
    case step.POWER_2:
        return `Pick a level one or two power for that discipline`
    case step.DISCIPLINES_1:
        return `Now select a discipline to have one dot from that same list`

    case step.PREDATOR:
        return predator()

    case step.PREDATOR_CHARACTERISTIC_1:
        return predator_characteristic_1(character)
    case step.PREDATOR_CHARACTERISTIC_2:
        return predator_characteristic_2(character)
    case step.PREDATOR_CHARACTERISTIC_3:
        return predator_characteristic_3(character)
    case step.PREDATOR_CHARACTERISTIC_4:
        return predator_characteristic_4(character)


    case step.ADVANTAGES_MERIT:
        return `Now choose advantages (merits) totalling up to 7 points separated by ;, if the merit can have multiple points select which one using a :, same for specifications, i.e <name>:<points>:<specification>

If you don't specify the points the smallest value is assumed, e.g. beautiful;allies:2:relaiability 1 effectivenes 1;iron_gullet.

You can type !help advantages to get a list, and !help advantage <name> for a more detailed description, e.g. !help advantage stake_bait`
    case step.ADVANTAGES_MERIT_CONFIRM_UNSPENT:
        return `You have not used all merit points, proceeding with this will discard remaining, if you choose to proceeds advantages step will start over and current ones will be deleted, do you wish to proceed?  y/n`
    case step.ADVANTAGES_FLAWS:
        return `Same as merits, but now for flaws, select at least 2 points`
    case step.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT:
        return `You have picked more than 2 points of flaws, this will not give you any extra points, do you wish to proceed?  y/n`

    case step.THIN_BLOOD_MERITS:
        return `You can choose from one to three thin blood merits, but in the next step you will need to choose the same number of thin blood flaws, e.g. anarch_comrades,discipline_affinity

You can see a list of thin blood merits typing !help thin_blood_adv, and specifics of each by passing the name, e.g. !help thin_blood_adv lifelike`
    case step.THIN_BLOOD_FLAWS:
        return `Now choose the same number of thin blood flaws, e.g. baby_teeth,dead_flesh`
    case step.CONVICTIONS_TOUCHSTONES:
        return `Select one to three convictions separated by ; with a touchstone attached using : in the format <conviction>:<touchstone>, e.g. don't kill innocents:Timmy, the vampire's child;reject wealth, for it corrupts:Harry, a homeless that used to live nearby

A conviction is something your vampire holds as a moral rule.
A touchstone is a person your vampire associates with that conviction.
`

    case step.FINISH:
        return "Finished creation"
    }

    return `This should never be visible, if it is step ${current_step} is missing an entry, report this`
}


function clan(){
    var reply = 'Now select a clan from the available options, you can type !help <clan name> for more information on the clan:\n'
    for(var clan in rules.clans){
        reply += '- ' + clan + '\n'
    }
    return reply
}

function skill_distribution(){
    var reply = 'Choose a skill distribution setup:\n'
    for(var i = 0; i < helpers.skill_distributions.length; i++){
        reply += '- ' + helpers.skill_distributions[i] + '\n'
    }
    return reply
}

    
function disciplines_2(character) {
    var reply = ''
    var disciplines = helpers.build_character_discipline_list(character)
    if(character.sheet.clan == 'thin_blood'){
        return `This should not have happened, thin blood characters aren't supposed to enter into the discipline step, please report this and the list of commands you gave to get here`
    }

    else if(character.sheet.clan == 'caitiff'){
        reply = 'Caitiff characters have no intrinsic disciplines, instead they can choose any two disciplines when creating a character, but they cost more xp to evolve later, select one discipline to have 2 dots:\n'
    }
    else{
        reply = 'Now select one discipline to have 2 dots from the list below:\n'
    }

    for(var discipline in disciplines){
        reply += '- ' + discipline + '\n'
    }
    return reply
}

function predator(){
    var reply = `Now select a predator type from the list below, you can type !help <predator type> to see information about each of them`
    for(var type in rules.predator_type)
        reply += '\n-  ' + type
    return reply
}

function predator_characteristic_1(character){
    if(character.sheet.predator == 'alleycat'){
        return 'Now choose a specialty, either "intimidation stickups" or "brawl grappling"'
    }
    return `${character.sheet.predator}: This predator type has not been created yet for step 1`
}

function predator_characteristic_2(character){
    if(character.sheet.predator == 'alleycat'){
        return 'Choose a discipline to gain one dot, either "celerity" or "potence"'
    }
    return `${character.sheet.predator}: This predator type has not been created yet for step 2`
}

function predator_characteristic_3(character){
    if(character.sheet.predator == 'alleycat'){
        return 'Pick a power for that discipline. You will lose one dot of humanity and gain three dots of criminal contacts'
    }
    
    return `${character.sheet.predator}: This predator type has not been created yet for step 3`
}

function predator_characteristic_4(character){
    return `${character.sheet.predator}: This predator type has not been created yet for step 4`
}
