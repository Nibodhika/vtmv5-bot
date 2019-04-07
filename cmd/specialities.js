var helper = require('./character_base.js');
const Character = require('../character.js');
const rules = require('../rules');

module.exports = function character_cmd(msg, args) {
    var who = msg.author;
    if(args.length > 1){
        who = args[1];
        // Why?
        if(who === 'null')
            who = null
        // allow me to mean me
        else if(who == 'me')
            who = msg.author
    }

    var character = Character.find(who);

    if(args.length <=2){
        if(character === undefined) {
            msg.reply("Could not find a character for " + who);
        }
        else{
            var reply = 'Character has the following specialities:'
            for(var skill in character.specialities){
                reply += '\n- ' + skill + ": " + character.specialities[skill]
            }
            msg.channel.send(reply)
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
                        msg.reply("Give me <skill>:<speciality>")
                    }
                    var skill = what[0]
                    var speciality = what[1]
                    var reply = character.add_speciality(skill, speciality)
                    msg.reply(reply)
                }
                else{
                    msg.reply("add what?");
                }
            }
            else if(['r', 'remove'].indexOf(option) > -1){
                if(args.length > 3){
                    var speciality = args.slice(3).join(' ');
                    var reply = character.remove_speciality(speciality)
                    msg.reply(reply)
                }
                else{
                    msg.reply("remove what?");
                }
            }
        }
    }
}
