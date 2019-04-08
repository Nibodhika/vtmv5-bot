const database = require('../database/database.js');

function do_create_character(name, player){
    var character = new database.Character(name, player);
    character.save()
    return character;
}

function print_sheet(character){

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
            name: 'Attributes',
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
            name: 'Skills',
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


    var fields = general_fields.concat(attribute_fields).concat(skill_fields)
    console.log(fields)
    return {
        embed: {
            title: character.sheet.name,
            fields: fields
    }}
}

module.exports = function health(msg, args){
    var is_gm = msg.member.roles.some(r=>["GM"].includes(r.name));

    var who = msg.author;
    if(args.length > 1){
        who = args[1];
        if(who === 'null')
            who = null
    }


    // var character = new database.Character('Alucard', who)
    // character.sheet.strength = 3
    // character.sheet.dexterity = 2
    // character.sheet.stamina = 2
    // msg.reply(print_sheet(character))
    // return 0;

    var character = database.Character.find(who);
    if(args.length <=2){
        if(character === undefined) {
            msg.reply("Could not find a character for " + who);
        }
        else{
            msg.channel.send(print_sheet(character))
        }
    }
    else{
        if(!is_gm){
            msg.reply("You can't do that");
        }
        else{
            var option = args[2];

            if(['c', 'create'].indexOf(option) > -1){
                if(args.length > 3){
                    character = do_create_character(args[3], who);
                    msg.reply(print_sheet(character))
                    msg.reply("Created character " + character.sheet.name);
                }
                else
                    msg.reply("Forgot to give the character a name");
            }
            else if(['s', 'set'].indexOf(option) > -1){
                if(args.length > 4){
                    var what = args[3];
                    var value = Number(args[4]);
                    var error = character.set(what, value)
                    if(error === null)
                        msg.reply(`Set ${what} to ${value} for ${character.sheet.name}`)
                    else{
                        msg.reply(error)
                    }
                }
                else{
                    msg.reply("Set what to which value?");
                }
            }
        }
    }

}
