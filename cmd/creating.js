const database = require('../database/database.js');
var helper = require('./character_base.js');
var rules = require('../rules/rules.js')
var Character = require('../character.js')

const step = {
    BEFORE: -1,
    WELCOME: 0,
    DELETE_CHARACTER: 1,
    ASK_NAME:2,
    NAME:3,
    CONCEPT:4,
    CLAN:5,

    ATTRIBUTE_4:6, // 1 attribute at 4
    ATTRIBUTE_3:7, // 3 attributes at 3
    ATTRIBUTE_2:8,  // 4 attributes at 2

    SKILL_DISTRIBUTION:9,

    JACK_3: 10, // 1 skill at 3
    JACK_2: 11, // 8 skills at 2
    JACK_1: 12, // 10 skills at 1

    BALANCED_3:13, // 3 skills at 3
    BALANCED_2:14, // 5 skills at 2
    BALANCED_1:15, // 7 skills at 1

    SPECIALIST_4:16, // 1 skill at 4
    SPECIALIST_3:17, // 3 skills at 3
    SPECIALIST_2:18, // 3 skills at 2
    SPECIALIST_1:19, // 3 skills at 1

    DISCIPLINES_2:20,
    DISCIPLINES_1:21,

    PREDATOR:22,

    FINISH:99,
}

const skill_distributions = [
    'jack of all trades',
    'balanced',
    'specialist',
]

function WELCOME(msg){
    var character = Character.find(msg.author);
    var reply = ""
    if(character === undefined) {
        msg.author.send("Welcome to the character creation helper");
        return ASK_NAME(msg);
    }

    msg.author.send(`You already have a character named ${character.sheet.name}, proceeding with this will delete it, do you wish to proceed? y/n `);
    console.log("will return 1")
    return step.DELETE_CHARACTER;
}
function DELETE_CHARACTER(msg){
    console.log("Calling delete character")
    if(['y', 'yes'].indexOf(msg.content.toLowerCase()) > -1){
        return ASK_NAME(msg);
    }
    else if(['n', 'no'].indexOf(msg.content.toLowerCase()) > -1){
        msg.author.send("Aborting character creation");
        return step.BEFORE;
    }

    msg.author.send(msg.content + " is not a valid response");
    return step.DELETE_CHARACTER;
}

function ASK_NAME(msg){
    console.log("asking name")
    msg.author.send("First tell me what's your character name");
    return step.NAME;
}

function NAME(msg){
    character = helper.do_create_character(msg.content, msg.author);
    msg.reply(`Created character ${character.sheet.name}, you can see his sheet at any point by sending !character`);
    msg.reply(`Now, tell me the core concept for him, type a phrase that succinctly describes your character, e.g. "Corrupt Police" or "Coward investigator"`)
    return step.CONCEPT;
}

function CONCEPT(msg){
    var character = Character.find(msg.author);
    character.sheet.concept = msg.content;
    character.save();
    var reply = 'Now select a clan from the available options, you can type !help <clan name> for more information on the clan:\n'
    for(var clan in rules.clans){
        reply += '- ' + clan + '\n'
    }
    msg.reply(reply);
    return step.CLAN;
}

function CLAN(msg){
    var selected_clan = msg.content.toLowerCase()
    if(Object.keys(rules.clans).indexOf(selected_clan) > -1){
        var character = Character.find(msg.author);
        character.sheet.clan = selected_clan;
        character.save();
        msg.reply('Great, now select one attribute to have 4 dots');
        return step.ATTRIBUTE_4
    }
    msg.reply('Unknown clan, select one from the list before');
    return step.CLAN
}

function set_attributes_skills_with_character(msg, character, amount, value, current_step, next_step, next_message, attribute) {
    console.log("called set_attributes_skills with "+msg.content)
    console.log(`amount ${amount}, value ${value} ${current_step}->${next_step}`)
    var name = attribute ? 'attribute' : 'skill';
    var unset_value = attribute ? 1 : 0;
    // 3 attributes
    var attr_list = [msg.content.toLowerCase()]
    if(amount > 1)
        attr_list = msg.content.toLowerCase().replace('\s+/g', '').split(',');
    if(attr_list.length != amount){
        msg.reply(`Please select exactly ${amount} attributes`)
        return current_step
    }
    for(var i=0; i<attr_list.length; i++){
        var what = attr_list[i];
        var meant = character.unalias_attr(what,attribute,!attribute);
        if(meant == undefined) {
            msg.reply(`${what} is not a valid ${name}`)
            return current_step
        }
        if(character.sheet[meant] != unset_value){
            msg.reply(`${meant} has already been chosen to have ${character.sheet[meant]} dots`);
            return current_step
        }
        character.sheet[meant] = value;
    }
    
    character.save();
    msg.reply(next_message);
    return next_step;
}
function set_attributes_skills(msg, amount, value, current_step, next_step, next_message, attribute) {
    var character = Character.find(msg.author);
    return set_attributes_skills_with_character(msg, character, amount, value, current_step, next_step, next_message, attribute)
}

function ATTRIBUTE_4(msg){
    return set_attributes_skills(
        msg,
        1,
        4,
        step.ATTRIBUTE_4,
        step.ATTRIBUTE_3,
        'Now select 3 attributes separated by coma to have 3 dots, e.g. "strength,stamina,resolve"',
        true
    )
}
function ATTRIBUTE_3(msg){
    return set_attributes_skills(
        msg,
        3,
        3,
        step.ATTRIBUTE_3,
        step.ATTRIBUTE_2,
        'Now select 4 attributes separated by coma to have 2 dots, e.g. "dexterity,charisma,composure,wits"',
        true
    );
}
function ATTRIBUTE_2(msg){
    var reply = 'Choose a skill distribution setup:\n'
    for(var i = 0; i < skill_distributions.length; i++){
        reply += '- ' + skill_distributions[i] + '\n'
    }
    return set_attributes_skills(
        msg,
        4,
        2,
        step.ATTRIBUTE_2,
        step.SKILL_DISTRIBUTION,
        reply,
        true
    );
}
function SKILL_DISTRIBUTION(msg){
    var selected = msg.content.toLowerCase()
    if(skill_distributions.indexOf(selected) > -1){
        if(selected == 'jack of all trades'){
            msg.reply('Now select 1 skills separated by coma to have 3 dots, e.g. "athletics,brawl,craft,etc..."');
            return step.JACK_3;
        }
        else if(selected == 'balanced'){
            msg.reply('Now select 3 skills separated by coma to have 3 dots, e.g. "athletics,brawl,craft"');
            return step.BALANCED_3;
        }
        else if(selected == 'specialist'){
            msg.reply('Now select 1 skill to have 4 dots, e.g. "technology"');
            return step.SPECIALIST_4;
        }
     
        msg.reply("Please report that "+selected+" is not valid");
        return step.BEFORE;
    }
    msg.reply(msg.content + " is not a valid skill distribution, please select one from the list above");
    return step.SKILL_DISTRIBUTION;
}


function JACK_3(msg){
    // 1 skill at 3
    return set_attributes_skills(
        msg,
        1,
        3,
        step.JACK_3,
        step.JACK_2,
        'Now select 8 skills separated by coma to have 2 dots, e.g. "athletics,brawl,craft,etc..."',
        false
    );
}
function JACK_2(msg){
    // 8 at 2
    return set_attributes_skills(
        msg,
        8,
        2,
        step.JACK_2,
        step.JACK_1,
        'Now select 10 skills separated by coma to have 1 dots, e.g. "athletics,brawl,craft,etc..."',
        false
    );
}

function build_character_discipline_list(character){
    var disciplines = []
    if(character.sheet.clan == 'thin_blood'){
    }    
    else if(character.sheet.clan == 'caitiff'){
        for(var discipline in rules.disciplines){
            if(discipline != 'thin_blood_alchemy')
                disciplines.push(discipline)
        }
    }
    else{
        for(var i in rules.clans[character.sheet.clan].disciplines)
            disciplines.push(rules.clans[character.sheet.clan].disciplines[i])
    }
    return disciplines
}

function step_after_skills(character){
    var reply = ''
    var next_step = step.DISCIPLINES_2
    if(character.sheet.clan == 'thin_blood'){
        reply = "Thin blood characters don't have disciplines available at character creation, so now tell me your predator type from the list below:\n"
        for(var type in rules.predator_type){
            reply += '- ' + type + '\n';
        }
        next_step = step.PREDATOR
    }    
    else if(character.sheet.clan == 'caitiff'){
        var reply = 'Caitiff characters have no intrinsic disciplines, instead they can choose any two disciplines when creating a character, but they cost more xp to evolve later, select one to have 2 dots:\n'
        for(var discipline in rules.disciplines){
            if(discipline != 'thin_blood_alchemy')
                reply += '- ' + discipline + '\n'
        }
            
    }
    else{
        var reply = 'Now select one discipline to have 2 dots from the list below:\n'
        for(var i in rules.clans[character.sheet.clan].disciplines)
            reply += '- ' + rules.clans[character.sheet.clan].disciplines[i] + '\n'
    }
    return [
        next_step,
        reply
    ]
}

function JACK_1(msg){
    var character = Character.find(msg.author);
    var next_step = step_after_skills(character);
    // 10 at 1
    return set_attributes_skills_with_character(
        msg,
        character,
        10,
        1,
        step.JACK_1,
        next_step[0],
        next_step[1],
        false
    );
}


function BALANCED_3(msg){
    // 3 at 3
    return set_attributes_skills(
        msg,
        3,
        3,
        step.BALANCED_3,
        step.BALANCED_2,
        'Now select 5 skills separated by coma to have 2 dots, e.g. "athletics,brawl,craft,etc..."',
        false
    );
}
function BALANCED_2(msg){
    // 5 at 2
    return set_attributes_skills(
        msg,
        5,
        2,
        step.BALANCED_2,
        step.BALANCED_1,
        'Now select 7 skills separated by coma to have 1 dots, e.g. "athletics,brawl,craft,etc..."',
        false
    );
}
function BALANCED_1(msg){
    var character = Character.find(msg.author);
    var next_step = step_after_skills(character);
    // 7 at 1
    return set_attributes_skills_with_character(
        msg,
        character,
        7,
        1,
        step.BALANCED_1,
        next_step[0],
        next_step[1],
        false
    );
}


function SPECIALIST_4(msg){
    // 1 at 4
    return set_attributes_skills(
        msg,
        1,
        4,
        step.SPECIALIST_4,
        step.SPECIALIST_3,
        'Now select 3 skills separated by coma to have 3 dots, e.g. "athletics,brawl,craft"',
        false
    );
}
function SPECIALIST_3(msg){
    // 3 at 3
    return set_attributes_skills(
        msg,
        3,
        3,
        step.SPECIALIST_3,
        step.SPECIALIST_2,
        'Now select 3 skills separated by coma to have 2 dots, e.g. "athletics,brawl,craft"',
        false
    );    
}
function SPECIALIST_2(msg){
    // 3 at 2
    return set_attributes_skills(
        msg,
        3,
        2,
        step.SPECIALIST_2,
        step.SPECIALIST_1,
        'Now select 3 skills separated by coma to have 1 dots, e.g. "athletics,brawl,craft"',
        false
    );
}
function SPECIALIST_1(msg){
    var character = Character.find(msg.author);
    var next_step = step_after_skills(character);
    // 3 at 1
    return set_attributes_skills_with_character(
        msg,
        character,
        3,
        1,
        step.SPECIALIST_1,
        next_step[0],
        next_step[1],
        false
    );
}

function set_discipline(msg, next_step, current_step, value, reply){
    var character = Character.find(msg.author);
    var available_disciplines = build_character_discipline_list(character)
    var discipline = msg.content.toLowerCase()
    if(available_disciplines.indexOf(discipline) > -1){
        character.sheet[discipline] = value;
        msg.reply(reply);
        return next_step
    }
    msg.reply(msg.content + " is not a valid discipline, please select one from the list above");
    return current_step
}

function DISCIPLINES_2(msg){
    var ret = set_discipline(msg,
                             step.DISCIPLINES_1,
                             step.DISCIPLINES_2,
                             2,
                             "Now select a discipline to have one dot from that same list"
                            );

    return ret

}
function DISCIPLINES_1(msg){
    var reply = "Good, so now tell me your predator type from the list below:\n"
    for(var type in rules.predator_type){
        reply += '- ' + type + '\n';
    }
    var ret = set_discipline(msg,
                             step.PREDATOR,
                             step.DISCIPLINES_1,
                             1,
                             reply
                            );
    return ret
}


function PREDATOR(msg){
    var predator_types = Object.keys(rules.predator_type)
    var type = msg.content.toLowerCase()
    if(predator_types.indexOf(type) > -1){
        var character = Character.find(msg.author);
        character.sheet['predator'] = type;
        return FINISH(msg)
    }
    msg.reply(type + " is not a valid predator type, choose one from the list above")
    return step.PREDATOR
}

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
    console.log("Moving to "+current_step)
    database.creation.set_step(who, current_step)
}

function do_create(msg, current_step) {
    console.log("Received a create with step " + current_step)
    
    switch(current_step){
    case step.WELCOME:
    case undefined:
        return WELCOME(msg);
    case step.DELETE_CHARACTER:
        console.log("I'm at the delete character step")
        return DELETE_CHARACTER(msg);
    case step.ASK_NAME:
        return ASK_NAME(msg);
    case step.NAME:
        return NAME(msg);
    case step.CONCEPT:
        return CONCEPT(msg);
    case step.CLAN:
        return CLAN(msg);

    case step.ATTRIBUTE_4:
        return ATTRIBUTE_4(msg);
    case step.ATTRIBUTE_3:
        return ATTRIBUTE_3(msg);
    case step.ATTRIBUTE_2:
        return ATTRIBUTE_2(msg);

    case step.SKILL_DISTRIBUTION:
        return SKILL_DISTRIBUTION(msg);

    case step.JACK_3:
        return JACK_3(msg);
    case step.JACK_2:
        return JACK_2(msg);
    case step.JACK_1:
        return JACK_1(msg);

    case step.BALANCED_3:
        return BALANCED_3(msg);
    case step.BALANCED_2:
        return BALANCED_2(msg);
    case step.BALANCED_1:
        return BALANCED_1(msg);

    case step.SPECIALIST_4:
        return SPECIALIST_4(msg);
    case step.SPECIALIST_3:
        return SPECIALIST_3(msg);
    case step.SPECIALIST_2:
        return SPECIALIST_2(msg);
    case step.SPECIALIST_1:
        return SPECIALIST_1(msg);

    case step.DISCIPLINES_2:
        return DISCIPLINES_2(msg);
    case step.DISCIPLINES_1:
        return DISCIPLINES_1(msg);
        
    case step.PREDATOR:
        return PREDATOR(msg);

    case step.FINISH:
        return FINISH(msg);
    default:
        msg.author.send("It seems you are not creating a character yet, first send the !create command")
    }
    return -1;
}
