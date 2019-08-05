var rules = require('../rules')

var Character = require('./character')

function help_attr_skill(alias, unalias_function, what, dict) {
    var reply = '';
    var specifications = null;
    
    if(alias) {
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
        reply = `Available ${what}s are:`
        specifications = {
            'physical': [],
            'social': [],
            'mental': [],
        }
        for(var k in dict){
            var elem = dict[k]
            specifications[elem.type].push(k)
        }
        
        // specifications = Object.keys(dict)
    }
    return {
        text: reply,
        specifications: specifications
    }
}

function base_help_advantage(advantage_name, dict, has_points, name){
    var specifications = null;
    if(advantage_name) {

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
    else {

        var merits = []
        var flaws = []
        for(var advantage in dict){
            var adv = dict[advantage]
            var line = ''
            // if('points' in adv)
            //     line = advantage + ' ('+adv.points+')'
            // else
            line = advantage

            adv.flaw ? flaws.push(line) : merits.push(line)
        }
        reply = name
        specifications = {
            "Merits": merits,
            "Flaws": flaws,
        }
    }
    return {
        text: reply,
        specifications: specifications
    }
}

module.exports = {

    TOPICS: {
        clan : ['clans', 'clan'],
        attribute : ['attributes', 'attribute', 'attr'],
        skill : ['skill', 'skills'],
        advantage : ['advantages','advantage','adv'],
        thin_blood_adv : ['thin_blood_advantages', 'thin_blood_advantage', 'thin_blood_adv'],
        topic: ['topic', 'topics'],
        discipline: ['discipline', 'disciplines'],
        predator_type: ['predator_type'],
        reroll: ['reroll'],
        humanity: ['humanity'],
        tenet: ['tenet', 'tenets']
    },
    
    topic: function(args){
        var reply = `Available topics are:`
        for(var t in this.TOPICS){
            reply += '\n- ' + this.TOPICS[t]
        }
        return {
            text: `Available topics are:`,
            specifications: Object.keys(this.TOPICS)
        }
    },

    clan: function(clan_name=null) {
        var reply = ''
        var specifications = null
        if(clan_name) {
            if(Object.keys(rules.clans).indexOf(clan_name) > -1) {
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
            reply = "The clan represents the vampire bloodline, available clans are:"
            specifications = Object.keys(rules.clans)
        }
        return {
            text:reply,
            specifications:specifications
        }
    },

    attribute: function(attr_name=null) {
        return help_attr_skill(attr_name,
                               Character.unalias_attr,
                               'attribute',
                               rules.attributes);
    },

    skills: function(skill_name=null) {
        return help_attr_skill(skill_name,
                               Character.unalias_skill,
                               'skill',
                               rules.skills);
    },


    advantage: function(advantage_name=null){
        return base_help_advantage(advantage_name,
                                   rules.advantages,
                                   true,
                                   'Advantages')
    },

    thin_blood_adv: function(advantage_name=null){
        return base_help_advantage(advantage_name,
                                   rules.thin_blood_adv,
                                   false,
                                   'Thin Blood Advantages')
    },

    discipline: function(discipline_name=null){
        var reply = ""

        var specifications = Object.keys(rules.disciplines)
        if(discipline_name) {
            if(Object.keys(rules.disciplines).indexOf(discipline_name) > -1){
                reply = rules.disciplines[discipline_name]
                specifications = null
            }
            else
                reply = `Unknown discipline ${discipline_name}, Available ones are:`
        }
        else
            reply = 'Available disciplines are:'

        return {
            text: reply,
            specifications: specifications
        }
    },

    reroll: function(){
        return {
            text: `Gives you a point of superficial damage to willpower and alows you to reroll up to three dice by values or types, e.g. "!reroll 1,2,3" would reroll all previous dice (that can be rerolled) that came out 1,2 or 3. There are also some alias:

- fail: rerolls anything that came 1,2,3,4,5
- tens: rerolls dices that came out 10
- nontens: rerolls every value that's not a 10
- messy: rerolls all failures and 10, useful for when you rolled a messy critical but still need more successes

You can combine values and types using , or +, e.g. "!reroll fail+10" is the same as "!reroll messy" or "!reroll 1,2,3,4,5,tens"
`,
            specifications: null
        }
    },

    predator_type: function(type_name=null){
        var reply = ""
        var specifications = null
        if(type_name) {
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
            specifications = Object.keys(rules.predator_type)
        }
        return {
            text: reply,
            specifications: specifications
        }
    },


    humanity: function(humanity_level=null){
        var specifications = null
        if(humanity_level) {
            if(isNaN(humanity_level) || humanity_level < 0 || humanity_level > 10){
                reply = `${humanity_level} is not a valid humanity level, only numbers from 0 to 10 are valid`
            }
            
            var reply = `Humanity ${humanity_level} has the following characteristics:`
            var humanity_rules = rules.humanity[humanity_level]
            for(var i in humanity_rules){
                reply += '\n- ' + humanity_rules[i]
            }
        }
        else{
            reply = "Humanity measures how human your vampire still is, give a level to get rule information for that humanity level"
            specifications = Object.keys(rules.humanity)
        }
        return {
            text: reply,
            specifications: specifications
        }
    },

    tenet: function(){
        var config = require('../config.json');

        var reply = "No tennet information"
        if("tenets" in config){
            reply = "Campaign has the following tenets:"
            for(var i in config.tenets){
                reply += '\n- ' + config.tenets[i]
            }
        }
        return reply
    },

    get(topic,specification){
        reply = undefined
        if(! topic){
            reply = this.topic()
        }
        else if(topic in this){
            reply = this[topic](specification)
        } else {
            for(var t in this.TOPICS){
                reply = `Unknown topic "${topic}"`
                var names = this.TOPICS[t]
                if(names.indexOf(topic) > -1){
                    console.log(t)
                    reply = this[t](specification)
                    break;
                }
            }
        }
        return reply
    }
}

