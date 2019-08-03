var helper = require('./character_base.js');
const Character = require('../models/character');
const rules = require('../rules');

module.exports = function character_cmd(msg, args) {
    var who = msg.author;
    if(args.length > 1){
        who = args[1];
    }

    var character = Character.find(who);

    if(args.length <=2){
        if(character === undefined) {
            msg.reply("Could not find a character for " + who);
        }
        else{

            specialties_fields = []
            var reply = 'Character has the following specialties:'
            for(var skill in character.specialties){
                var specialties = character.specialties[skill]
                for(var specialty in specialties){
                    specialties_fields.push({
                        name: skill,
                        value: specialties[specialty]
                    })    
                }
            }
            msg.channel.send({
                embed:{
                    title: `Specialties`,
                    description: `${who}`,
                    fields: specialties_fields
                }
            })
        }
    }
    else{
        if(msg.channel.name === undefined)
            return 1;
        var is_gm = msg.member.roles.some(r=>["GM"].includes(r.name));
        if(!is_gm){
            msg.reply("You can't do that");
        }
        else {
            var option = args[2];

            if(['a', 'add'].indexOf(option) > -1) {
                if(args.length > 3){
                    var what = args.slice(3).join(' ').split(':');
                    if(what.length < 2){
                        msg.reply("Give me <skill>:<specialty>")
                        return
                    }
                    var skill = what[0]
                    var specialty = what[1]
                    var reply = character.add_specialty(skill, specialty)
                    msg.reply(reply)
                }
                else{
                    msg.reply("add what?");
                }
            }
            else if(['r', 'remove'].indexOf(option) > -1){
                if(args.length > 3){
                    var specialty = args.slice(3).join(' ');
                    var reply = character.remove_specialty(specialty)
                    msg.reply(reply)
                }
                else{
                    msg.reply("remove what?");
                }
            }
        }
    }
}
