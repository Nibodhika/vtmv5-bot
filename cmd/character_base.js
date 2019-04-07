var database = require('../database')
const rules = require('../rules');
const Character = require('../character.js');

function do_create_character(name, player) {
    var old_character = Character.find(player)
    if(old_character != undefined)
        database.character.delete(old_character.sheet.id)
    var character = new Character(name, player);
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


    var disciplines_field = [
        {
            name: '====================== Disciplines=======================',
            value: "======================================================"
        }
    ]

    for(var discipline in rules.disciplines){
        if(character.sheet[discipline] > 0){
            disciplines_field.push({
                name: discipline,
                inline: true,
                value: `${character.sheet[discipline]}`
            })
        }
    }

    var advantages_field = [
        {
            name: '====================== Advantages =======================',
            value: "======================================================"
        }
    ]

    for(var adv in character.advantages){
        var advantage = character.advantages[adv]

        advantages_field.push({
            name: `${adv} (${advantage.points})`,
            inline: true,
            value: dash_on_empty(advantage.specification)
        })
    }

    for(var adv in character.thin_blood_adv){
        var specification = character.thin_blood_adv[adv]

        advantages_field.push({
            name: `${adv}`,
            inline: true,
            value: dash_on_empty(specification)
        })
    }

    var status_fields = [
        {
            name: '========================= Status =========================',
            value: "======================================================"
        },
        {
            name: 'Health',
            inline: true,
            value: build_life_bar(character.sheet)
        },
        {
            name: 'Hunger',
            inline: true,
            value: `____   ${character.sheet.hunger}   ____`
        },
        {
            name: 'Humanity',
            inline: true,
            value: build_humanity_bar(character.sheet)
        },
        {
            name: 'Willpower',
            inline: true,
            value: build_willpower_bar(character.sheet)
        },
        {
            name: 'Resonance',
            inline: true,
            value: dash_on_empty(character.sheet.resonance)
        },
    ]

    var fields = general_fields.concat(attribute_fields).concat(skill_fields).concat(advantages_field)
    if(disciplines_field.length > 1)
        fields = fields.concat(disciplines_field)
    fields = fields.concat(status_fields)
    return {
        embed: {
            title: character.sheet.name,
            description: character.sheet.concept,
            fields: fields
    }}
}

function build_bar(character_sheet, which, full_info=false){
    // Notice this should receive character.sheet
    var letter = which[0]
    var superficial = character_sheet[letter+'_superficial']
    var aggravated = character_sheet[letter+'_aggravated']
    var total_damage = superficial + aggravated
    var remaining_life = character_sheet[which] - total_damage

    var life_bar = ""
    for(var i =0; i < character_sheet[which]; i++){
        if(i < aggravated)
            life_bar += '[X]'
        else if(i < total_damage)
            life_bar+='[/]'
        else
            life_bar+='[ ]'
    }
    if(full_info)
        return {
            bar:life_bar,
            damage: total_damage,
            remaining: remaining_life,
            life: character_sheet[which]
        }
    return life_bar
}

function build_life_bar(character_sheet, full_info=false){
    return build_bar(character_sheet,'health', full_info)
}
function build_willpower_bar(character_sheet, full_info=false){
    return build_bar(character_sheet,'willpower', full_info)
}

function build_humanity_bar(character_sheet){
    var humanity = character_sheet.humanity
    var stains = character_sheet.stains
    var life_bar = ""
    for(var i =0; i < 10; i++){
        if(i < humanity){
            life_bar += '[X]'
        }
        else if(i >= (10 - stains)){
            life_bar += '[/]'
        }
        else
            life_bar += '[ ]'
    }
    return life_bar
}

module.exports.do_create_character = do_create_character
module.exports.print_sheet = print_sheet
module.exports.build_life_bar = build_life_bar
module.exports.build_willpower_bar = build_willpower_bar
module.exports.build_humanity_bar = build_humanity_bar
