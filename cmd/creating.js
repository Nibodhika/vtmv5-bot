const database = require('../database/database.js');
var helper = require('./character_base.js');

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
    BALANCED_1:14, // 7 skills at 1

    SPECIALIST_4:15, // 1 skill at 4
    SPECIALIST_3:16, // 3 skills at 3
    SPECIALIST_2:17, // 3 skills at 2
    SPECIALIST_1:18, // 3 skills at 1

    DISCIPLINES:19,
    PREDATOR:20,

    FINISH:99,
}

const clans = {
    brujah:{
        disciplines: ['celerity', 'potence', 'presence'],
        bane: `The Blood of the Brujah simmers with barely contained rage, exploding at the slightest provocation. Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die`
    },
    gangrel:{
        disciplines: ['animalism', 'fortitude', 'protean'],
        bane: `Gangrel relate to their Beast much as other Kindred relate to the Gangrel: suspicious partnership. In frenzy, Gangrel gain one or more animal features: a physical trait, a smell, or a behavioral tic. These features last for one more night afterward, lingering like a hangover following debauchery. Each feature reduces one Attribute by 1 point – the Storyteller may decide that a forked tongue or bearlike musk reduces Charisma, while batlike ears reduce Resolve (“all those distracting sounds”). If nothing immediately occurs to you, the feature reduces Intelligence or Manipulation. The number of features a Gangrel manifests equals their Bane Severity. If your character Rides the Wave of their frenzy (see p. 219) you can choose only one feature to manifest, thus taking only one penalty to their Attributes`
    },
    malkavian:{
        disciplines: ['auspex','dominate','obfuscate'],
        bane: `Afflicted by their lineage, all Malkavians are cursed with at least one type of mental derangement. Depending on their history and the state of their mind at death, they may experience delusions, visions of terrible clarity, or something entirely different. When the Malkavian suffers a Bestial Failure or a Compulsion, their curse comes to the fore. Suffer a penalty equal to your character’s Bane Severity to one category of dice pools (Physical, Social, or Mental) for the entire scene. This is in addition to any penalties incurred by Compulsions. You and the Storyteller decide the type of penalty and the exact nature of the character’s affliction during character creation`
    },
    nosferatu:{
        disciplines: ['animalism','obfuscate','potence'],
        bane: `Hideous and vile, all Nosferatu count as having the Repulsive Flaw (-2) and can never increase their rating in the Looks Merit. In addition, any attempt to disguise themselves as human incur a penalty to your dice pool equal to your character’s Bane Severity (this includes the Obfuscate powers Mask of a Thousand Faces and Impostor’s Guise)`
    },
    toreador:{
        disciplines: ['auspex','celerity','presence'],
        bane: `Toreador exemplify the old saying that art in the blood takes strange forms. They desire beauty so intensely that they suffer in its absence. While your character finds itself in less than beautiful surroundings, lose the equivalent of their Bane Severity in dice from dice pools to use Disciplines. The Storyteller decides specifically how the beauty or ugliness of the Toreador’s environment (including clothing, blood dolls, etc.) penalizes them, based on the character’s aesthetics. That said, even devotees of the Ashcan School never find normal streets perfectly beautiful. This obsession with aesthetics also causes divas to lose themselves in moments of beauty and a bestial failure often results in a rapt trance, as detailed in the Compulsion rules (p. 208)`
    },
    tremere:{
        disciplines: ['auspex','dominate','blood sorcery'],
        bane: `Once the clan was defined by a rigid hierarchy of Blood Bonds reaching from the top to the bottom of the Pyramid. But after the fall of Vienna, their Blood has recoiled and aborted all such connections. Tremere vitae can no longer Blood Bond other Kindred, though they themselves can be Bound by Kindred from other clans. A Tremere can still bind mortals and ghouls, though the corrupted vitae must be drunk an additional number of times equal to the vampire’s Bane Severity for the bond to form. Some theorize this change is the revenge of the Antediluvian devoured by Tremere, others attribute it to a simple mutation. Regardless, the clan studies
their vitae intently to discover if the process can be reversed, and, indeed, determine if they would want to do so`
    },
    ventrue:{
        disciplines: ['dominate','fortitude','presence'],
        bane: `The Ventrue are in possession of rarefied palates. When a Ventrue drinks blood from any mortal outside their preference, a profound exertion of will is required or the blood taken surges back up as scarlet vomit. Preferences range greatly, from Ventrue who can only feed from genuine brunettes, individuals of Swiss descent, or homosexuals, to others who can only feed from soldiers, mortals who suffer from PTSD, or methamphetamine users. With a Resolve + Awareness test (Dif-
ficulty 4 or more) your character can sense if a mortal possesses the blood they require. If you want your character to feed from anything but their preferred victim, you must spend Willpower points equal to the character’s Bane Severity`
    },
    caitiff:{
        disciplines: [],
        bane: `Untouched by the Antediluvians, the Caitiff share no common bane. Caitiff characters begin with the Suspect (•) Flaw and you may not purchase positive Status for them during character creation. The Storyteller may always impose a one or two dice penalty on Social tests against fellow Kindred who know they are Caitiff, regardless of their eventual Status. Further, to improve one of the Disciplines of a Caitiff costs six times the level purchased in experience points`
    },
    thin_blood:{
        disciplines: [],
        bane: `A thin-blood is always considered clanless and never suffers any specific clan bane or compulsion.`
    },
}

const skill_distributions = [
    'jack of all trades',
    'balanced',
    'specialist',
]

const predator_type = {
    alleycat:{
        description:'You take blood by force or threat.',
        characteristics:[
            'Add a specialty: Intimidation (Stickups) or Brawl (Grappling)',
            'Gain one dot of Celerity or Potence',
            'Lose one dot of Humanity',
            'Gain three dots of criminal Contacts'
        ]
    },
    bagger:{
        description:'You acquire preserved or dead blood, rather than hunt the living.',
        characteristics:[
            'Add a specialty: Larceny (Lockpicking) or Streetwise (BlackMarket)',
            'Gain one dot of Blood Sorcery (Tremere only) or Obfuscate',
            'Gain the Feeding Merit: Iron Gullet (•••)',
            'Gain the Enemy Flaw: (••) Either someone believes you owe them, or there’s another reason you keep off the streets.'
        ]
    },
    blood_leech:{
        description:'You feed from other vampires.',
        characteristics:[
            'Add a specialty: Brawl (Kindred) or Stealth (against Kindred)',
            'Gain one dot of Celerity or Protean',
            'Lose one dot of Humanity',
            'Increase Blood Potency by one',
            'Gain the Dark Secret Flaw: (••) Diablerist, or the Shunned Flaw: (••)',
            'Gain the Feeding Flaw: (••) Prey Exclusion (mortals)'
        ]
    },
    cleaver:{
        description:'You take blood covertly from your mortal family or friends.',
        characteristics:[
            'Add a specialty: Persuasion (Gaslighting) or Subterfuge (Coverups)',
            'Gain one dot of Dominate or Animalism',
            'Gain the Dark Secret Flaw: (•)Cleaver',
            'Gain the Herd Advantage (••)'
        ]
    },
    consensualist:{
        description:'You take blood with consent.',
        characteristics:[
            'Add a specialty: Medicine (Phlebotomy) or Persuasion (Victims)',
            'Gain one dot of Auspex or Fortitude',
            'Gain one dot of Humanity',
            'Gain the Dark Secret Flaw: (•) Masquerade Breacher',
            'Gain the Feeding Flaw: (•) Prey Exclusion (non consenting)'
        ]
    },
    farmer:{
        description:'You feed from animals.',
        characteristics:[
            'Add a specialty: Animal Ken (Specific Animal) or Survival (Hunting)',
            'Gain one dot of Animalism or Protean',
            'Gain one dot of Humanity',
            'Gain the Feeding Flaw: (••) Vegan'
        ]
    },
    osiris:{
        description:'As an object of devotion, you feed from your cult, church, or fans.',
        characteristics:[
            'Add a specialty: Occult (specific tradition) or Performance (specific entertainment field)',
            'Gain one dot of Blood Sorcery (Tremere only) or Presence',
            'Spend three dots between the Fame and Herd Backgrounds',
            'Spend two dots between the Enemies and Mythic Flaws'
        ]
    },
    sandman:{
        description:'You feed from sleeping victims, often breaking into homes.',
        characteristics:[
            'Add a specialty: Medicine (Anesthetics) or Stealth (Break-in)',
            'Gain one dot of Auspex or Obfuscate',
            'Gain one dot of Resources'
        ]
    },
    scene_queen:{
        description:'You feed from a subculture or exclusive group in which you enjoy high status.',
        characteristics:[
            'Add a specialty: Etiquette (specific scene), Leadership (specific scene), or Streetwise (specific scene)',
            'Gain one dot of Dominate or Potence',
            'Gain the Fame Advantage: (•)',
            'Gain the Contact Advantage: (•)',
            'Gain either the Influence Flaw: (•) Disliked (outside your subculture) or the Feeding Flaw: (•) Prey Exclusion (a different subculture from yours)'
        ]
    },
    siren:{
        description:'You feed by seduction, under the guise of sex.',
        characteristics:[
            'Add a specialty: Persuasion (Seduction) or Subterfuge (Seduction)',
            'Gain one dot of Fortitude or Presence',
            'Gain the Looks Merit: (••) Beautiful',
            'Gain the Enemy Flaw: (•) A spurned lover or jealous partner'
        ]
    }
}

function WELCOME(msg){
    var character = database.Character.find(msg.author);
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
    var character = database.Character.find(msg.author);
    character.sheet.concept = msg.content;
    character.save();
    var reply = 'Now select a clan from the available options:\n'
    for(var clan in clans){
        reply += '- ' + clan + '\n'
    }
    msg.reply(reply);
    return step.CLAN;
}

function CLAN(msg){
    var selected_clan = msg.content.toLowerCase()
    if(Object.keys(clans).indexOf(selected_clan) > -1){
        var character = database.Character.find(msg.author);
        character.sheet.clan = selected_clan;
        character.save();
        msg.reply('Great, now select one attribute to have 4 dots');
        return step.ATTRIBUTE_4
    }
    msg.reply('Unknown clan, select one from the list before');
    return step.CLAN
}

function set_attributes(msg, amount, value, current_step, next_step, next_message) {
    console.log("called set_attribute with "+msg.content)
    console.log(`amount ${amount}, value ${value} ${current_step}->${next_step}`)
    // 3 attributes
    var character = database.Character.find(msg.author);
    var attr_list = [msg.content.toLowerCase()]
    if(amount > 1)
        attr_list = msg.content.toLowerCase().replace('\s+/g', '').split(',');
    if(attr_list.length != amount){
        msg.reply(`Please select exactly ${amount} attributes`)
        return current_step
    }
    for(var i=0; i<attr_list.length; i++){
        var what = attr_list[i];
        var meant = character.get(what,true,false);
        if(meant == undefined) {
            msg.reply(`${what} is not a valid attribute`)
            return current_step
        }
        character.sheet[meant] = value;
    }
    
    character.save();
    msg.reply(next_message);
    return next_step;
}

function ATTRIBUTE_4(msg){
    return set_attributes(
        msg,
        1,
        4,
        step.ATTRIBUTE_4,
        step.ATTRIBUTE_3,
        'Now select 3 attributes separated by coma to have 3 dots, e.g. "strength,stamina,resolve"'
    )
}
function ATTRIBUTE_3(msg){
    return set_attributes(
        msg,
        3,
        3,
        step.ATTRIBUTE_3,
        step.ATTRIBUTE_2,
        'Now select 4 attributes separated by coma to have 2 dots, e.g. "dexterity,charisma,composure,wits"'
    );
}
function ATTRIBUTE_2(msg){
    var reply = 'Choose a skill distribution setup:\n'
    for(var i = 0; i < skill_distributions.length; i++){
        reply += '- ' + skill_distributions[i] + '\n'
    }
    return set_attributes(
        msg,
        4,
        2,
        step.ATTRIBUTE_2,
        step.SKILL_DISTRIBUTION,
        reply
    );
}
function SKILL_DISTRIBUTION(msg){
    var selected = msg.content.toLowerCase()
    if(skill_distribution.indexOf(selected) > -1){
        msg.reply("selected " + selected);
        return step.BEFORE;
    }
    msg.reply(msg.content + " is not a valid skill distribution, please select one from the list above");
    return step.SKILL_DISTRIBUTION;
}


function JACK_3(msg){
    
}
function JACK_2(msg){
    
}
function JACK_1(msg){
    
}


function BALANCED_3(msg){
    
}
function BALANCED_2(msg){
    
}
function BALANCED_1(msg){
    
}


function SPECIALIST_4(msg){
    
}
function SPECIALIST_3(msg){
    
}
function SPECIALIST_2(msg){
    
}
function SPECIALIST_1(msg){
    
}

function DISCIPLINES(msg){
    
}

function PREDATOR(msg){
    
}

function FINISH(msg){
    msg.author.send("finished creation");
    return step.BEFORE;
}

module.exports = function creating_cmd(msg, current_step){
    console.log("Received a create with step " + current_step)
    console.log("is current step DELETE? " + current_step == step)
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

    case step.DISCIPLINES:
        return DISCIPLINES(msg);
    case step.PREDATOR:
        return PREDATOR(msg);

    case step.FINISH:
        return FINISH(msg);
    default:
        msg.author.send("It seems you are not creating a character yet, first send the !create command")
    }
    return -1;
}
