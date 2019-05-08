const rules = require('../rules');
const Character = require('../character')

var help_str = `Valid commands are:
!help [topic] [specification]
    Prints this help, or help on a specific topic, try !help topics to see a list of available topics
!roll [amount=1] [difficulty=1]
    Rolls [amount] of dice
!reroll <type or values>
    Spends a willpower to reroll by type or values, "!help reroll" for more information
!hunger [who=author]
    Check the hunger of a player
!willpower [who=author]
    Check the willpower of a player
!health [who=author]
    Check the health of a player
!character [who=author]
    Check the character sheet of a player
!convictions [who=author]
    List convictions and touchstones
!rouse [amount=1]
    Does a rouse check
!frenzy [difficulty=1]
    Does a frenzy test
!create
    Starts the character creation in a DM
!humanity [who=author]
`

var topics = {
    clan : ['clans', 'clan'],
    attr : ['attributes', 'attribute', 'attr'],
    skills : ['skill', 'skills'],
    advantage : ['advantages','advantage','adv'],
    thin_blood_adv : ['thin_blood_advantages', 'thin_blood_advantage', 'thin_blood_adv'],
    topics: ['topic', 'topics'],
    disciplines: ['discipline', 'disciplines'],
    predator_type: ['predator_type'],
    reroll: ['reroll'],
    humanity: ['humanity'],
    tenets: ['tenets']
}

function help_cmd(msg, args){
    var reply = help_str
    if(args.length > 1) {
        var about = args[1]
        
        reply = undefined
        for(var topic in topics){
            var names = topics[topic]
            if(names.indexOf(about) > -1){
                reply = help[topic](args)
                break;
            }
        }
        if(reply === undefined)
            reply = `I don't know about "${about}"`
    }
    msg.reply(reply);
}

module.exports.help_cmd = help_cmd
module.exports.help_str = help_str

// Helper object to contain all individual commands
var help = {}

help.clan = function(args) {
    var reply = ''
    if(args.length > 2) {
        var clan_name = args[2]
        if(Object.keys(rules.clans).indexOf(clan_name) > -1){
            var clan = rules.clans[clan_name]
            reply = clan.description
            if(clan_name == 'thin_blood') {
                reply += "\nThin blood don't have clan disciplines but instead have access to " + clan.disciplines
            }
            else if(clan_name == 'caitiff') {
                reply += '\nCaitiff can pick any two disciplines, but they count as non-clan for xp purchase cost'
            }
            else{
                reply += '\nClan disciplines are '+clan.disciplines
            }
        }
        else{
            reply = `Unknown clan ${clan_name}`
        }
    }
    else{
        reply = "The clan represents the vampire bloodline, available clans are:\n"
        for(var clan in rules.clans){
            reply += '- ' + clan + '\n'
        }
    }
    return reply
}

function help_attr_skill(args, unalias_function, what, dict) {
    reply = ''
    if(args.length > 2) {
        var alias = args[2]
        var name = unalias_function(alias)
        if(name === undefined){
            reply = `Unknown ${what} ${alias}`
        }
        else {
            var attr = dict[name]
            reply = attr.description;
            reply += `\n\nAlias: ` + attr.alias
        }
    }
    else{
        reply = `Available ${what}s (and alias) are:`
        for(var elem in dict){
            reply += '\n-  ' + elem + " ("+dict[elem].alias+")"
        }
    }
    return reply
}

help.attr = function(args) {
    return help_attr_skill(args,
                           Character.unalias_attr,
                           'attribute',
                           rules.attributes);
}

help.skills = function(args) {
    return help_attr_skill(args,
                           Character.unalias_skill,
                           'skill',
                           rules.skills);
}


function base_help_advantage(args, dict, has_points, name){

    if(args.length > 2) {
        var advantage_name = args[2]

        if(Object.keys(dict).indexOf(advantage_name) > -1){
            var advantage = dict[advantage_name]
            if(advantage.flaw)
                reply = "Flaw "
            else
                reply = "Merit "

            if(has_points)
                reply += advantage.points
            
            reply += "\n"+advantage.description;
        }
        else {
            reply = `Unknown advantage ${advantage_name}`
        }
    }
    else{

        var merits = ''
        var flaws = ''
        for(var advantage in dict){
            var adv = dict[advantage]
            var line = ''
            if('points' in adv)
                line = '\n-  ' + advantage + '('+adv.points+')'
            else
                line = '\n-  ' + advantage
            if(adv.flaw)
                flaws += line
            else
                merits += line
        }        
        reply = {
            embed: {
                title: name,
                fields : [
                    {
                        name:'Merits',
                        inline:true,
                        value: merits
                    },
                    {
                        name:'Flaws',
                        inline:true,
                        value: flaws
                    }
                ]
            }
        }
    }
    return reply
}

help.advantage = function(args){
    return base_help_advantage(args,
                               rules.advantages,
                               true,
                               'Advantages')
}

help.thin_blood_adv = function(args){
    return base_help_advantage(args,
                               rules.thin_blood_adv,
                               false,
                               'Thin Blood Advantages')
}

help.topics = function(args){
    var reply = `Available topics are:`
    for(var t in topics){
        reply += '\n- ' + topics[t]
    }
    return reply
}

help.disciplines = function(args){
    if(args.length > 2) {
        var discipline_name = args[2]
        if(Object.keys(rules.disciplines).indexOf(discipline_name) > -1)
            return rules.disciplines[discipline_name]
        return `Unknown discipline ${discipline_name}`
    }
    var reply = 'Available disciplines are:'
    for(var discipline in rules.disciplines)
        reply += '\n- ' + discipline
    return reply
}

help.reroll = function(args){
    return `Gives you a point of superficial damage to willpower and alows you to reroll up to three dice by values or types, e.g. "!reroll 1,2,3" would reroll all previous dice (that can be rerolled) that came out 1,2 or 3. There are also some alias:

- fail: rerolls anything that came 1,2,3,4,5
- tens: rerolls dices that came out 10
- nontens: rerolls every value that's not a 10
- messy: rerolls all failures and 10, useful for when you rolled a messy critical but still need more successes

You can combine values and types using , or +, e.g. "!reroll fail+10" is the same as "!reroll messy" or "!reroll 1,2,3,4,5,tens"
`
}

help.predator_type = function(args){
    var reply = ""
    if(args.length > 2) {
        var type_name = args[2]
        if(Object.keys(rules.predator_type).indexOf(type_name) > -1){
            var type = rules.predator_type[type_name]
            reply = type.description
            for(var i in type.characteristics){
                reply += '\n- ' + type.characteristics[i]
            }
        }
        else{
            reply = `Unknown predator type ${type_name}`
        }
    }
    else{
        reply = "Available predator types are:"
        for(var type in rules.predator_type){
            reply += '\n- ' + type
        }
    }
    return reply
}

help.humanity = function(args){
    if(args.length > 2) {
        var humanity_level = Number(args[2])
        if(isNaN(humanity_level) || humanity_level < 0 || humanity_level > 10){
            reply = `args[2] is not a valid humanity level, only numbers from 0 to 10 are valid`
        }
        
        var reply = `Humanity ${humanity_level} has the following characteristics:`
        var humanity_rules = rules.humanity[humanity_level]
        for(var i in humanity_rules){
            reply += '\n- ' + humanity_rules[i]
        }
    }
    else{
        reply = "Humanity measures how human your vampire still is, give a level to get rule information for that humanity level"
    }
}

help.tenets = function(args){
    var config = require('../config.json');

    var reply = "No tennet information"
    if("tenets" in config){
        reply = "Campaign has the following tenets:"
        for(var i in config.tenets){
            reply += '\n- ' + config.tenets[i]
        }
    }
    return reply
}
