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

function dash_on_empty(variable){
    var out = variable;
    if(!out)
        out = '-'
    return out
}

function print_status(character) {
    var willpower_bar = build_willpower_bar(character.sheet)
    var life_bar = build_life_bar(character.sheet)
    var fields = [
        {
            name: `Desire`,
            value: dash_on_empty(character.sheet.desire)
        },
        {
            name: `Humanity ${character.sheet.humanity}/${10-character.sheet.humanity-character.sheet.stains}/${character.sheet.stains}`,
            value: build_humanity_bar(character.sheet)
        },
        {
            name: 'Resonance',
            value: dash_on_empty(character.sheet.resonance)
        },
        {
            name: `Willpower ${willpower_bar.remaining}/${willpower_bar.life}`,
            value: willpower_bar.bar
        },
        {
            name: `Health ${life_bar.remaining}/${life_bar.life}`,
            value: life_bar.bar
        },
        {
            name: 'Hunger',
            value: `${character.sheet.hunger}`
        },
    ]


    return {
        embed: {
            title: character.sheet.name,
            description: character.sheet.player,
            fields: fields
        }}
}

function print_sheet(character) {

    var general_fields = [
        {
            name: `Ambition`,
            value: dash_on_empty(character.sheet.ambition)
        },
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
            value: '======================= Attributes ========================',
            name: '\u200b'
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
            value: '========================= Skills ==========================',
            name: '\u200b'
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
            value: '====================== Disciplines=======================',
            name: '\u200b'
        }
    ]
    var disciplines = ""
    for(var discipline in rules.disciplines){
        if(character.sheet[discipline] > 0){
            disciplines_field.push({
                name: `${discipline}: ${character.sheet[discipline]}`,
                inline: true,
                value: "-" // TODO list the powers for this discipline
            })
        }
    }

    var advantages_field = [
        {
            value: '====================== Advantages ========================',
            name: '\u200b'
        }
    ]

    var merits = ""
    var flaws = ""
    
    for(var adv in character.advantages){
        var advantage = character.advantages[adv]
        if(rules.advantages[adv].flaw){
            flaws += `\n**${adv} (${advantage.points})**
${dash_on_empty(advantage.specification)}`
        }
        else{
            merits += `\n**${adv} (${advantage.points})**
${dash_on_empty(advantage.specification)}`
        }
            
    }

    advantages_field.push({
            name: `Merits`,
            inline: true,
            value: dash_on_empty(merits)
    })

    advantages_field.push({
            name: `Flaws`,
            inline: true,
            value: dash_on_empty(flaws)
    })

    if(character.sheet.clan == 'thin_blood'){
        var thin_blood_adv = ""
        for(var adv in character.thin_blood_adv){
            var specification = character.thin_blood_adv[adv]
            var merit_or_flaw = rules.thin_blood_adv[adv].flaw ? 'flaw' : 'merit'
            thin_blood_adv += `\n**${adv} (${merit_or_flaw})**
${dash_on_empty(specification)}`
        }

        advantages_field.push({
            name: `Thin Blood`,
            inline: true,
            value: dash_on_empty(thin_blood_adv)
        })    
    }
        

    var fields = general_fields.concat(attribute_fields).concat(skill_fields).concat(advantages_field)
    if(disciplines_field.length > 1)
        fields = fields.concat(disciplines_field)

    return {
        embed: {
            title: character.sheet.name,
            description: character.sheet.concept,
            fields: fields
    }}
}

function build_bar(character_sheet, which){
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

    return {
        bar:life_bar,
        damage: total_damage,
        remaining: remaining_life,
        life: character_sheet[which]
    }

}

function build_life_bar(character_sheet){
    return build_bar(character_sheet,'health')
}
function build_willpower_bar(character_sheet){
    return build_bar(character_sheet,'willpower')
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
module.exports.print_status = print_status
module.exports.build_life_bar = build_life_bar
module.exports.build_willpower_bar = build_willpower_bar
module.exports.build_humanity_bar = build_humanity_bar
