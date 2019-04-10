const database = require('../database/database.js');

function do_create_character(name, player) {
    var character = new database.Character(name, player);
    character.save()
    return character;
}

function print_sheet(character) {

    function dash_on_empty(variable){
        var out = variable;
        if(!out)
            out = '-'
        return out
    }

    var general_fields = [
        {
            name: 'Player',
            value: dash_on_empty(character.sheet.player),
            inline: true
        },
        {
            name: 'Clan',
            value: dash_on_empty(character.sheet.clan),
            inline: true
        },
        {
            name: 'Generation',
            value: dash_on_empty(character.sheet.generation),
            inline: true
        }
    ]
    
    function print_attr(attr){
        var out = ''
        for(var name in attr){
            out += name + ": " + attr[name] + "\n"
        }
        return out;
    }
    
    var attributes = character.get_attributes()
    var attribute_fields = [
        {
            name: '===============',
            value: '------------------------',
            inline: true
        },
        {
            name: '==== Attributes ====',
            value: '------------------------',
            inline: true
        },
        {
            name: '===============',
            value: '------------------------',
            inline: true
        },
        
        {
            name: 'Physical',
            inline: true,
            value: print_attr(attributes.physical)
        },
        {
            name: 'Social',
            inline: true,
            value: print_attr(attributes.social)
        },
        {
            name: 'Mental',
            inline: true,
            value: print_attr(attributes.mental)
        },
    ]

    var skills = character.get_skills()
    var skill_fields = [
                {
            name: '===============',
            value: '------------------------',
            inline: true
        },
        {
            name: '==== Skills ====',
            value: '------------------------',
            inline: true
        },
        {
            name: '===============',
            value: '------------------------',
            inline: true
        },

        {
            name: 'Physical',
            inline: true,
            value: print_attr(skills.physical)
        },
        {
            name: 'Social',
            inline: true,
            value: print_attr(skills.social)
        },
        {
            name: 'Mental',
            inline: true,
            value: print_attr(skills.mental)
        },
    ]

    var status_fields = [
        {
            name: '========================= Status =========================',
            value: "======================================================"
        },
        {
            name: 'Humanity',
            inline: true,
            value: `${character.sheet.humanity} [${character.sheet.stains}]`
        },
        {
            name: 'Hunger',
            inline: true,
            value: `${character.sheet.hunger}`
        },
        {
            name: 'Health',
            inline: true,
            value: `${character.get_health()}`
        },
    ]

    var fields = general_fields.concat(attribute_fields).concat(skill_fields).concat(status_fields)
    return {
        embed: {
            title: character.sheet.name,
            description: character.sheet.concept,
            fields: fields
    }}
}

module.exports.do_create_character = do_create_character
module.exports.print_sheet = print_sheet
