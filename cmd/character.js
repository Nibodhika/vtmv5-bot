var helper = require('./character_base.js');
const Character = require('../character.js');

module.exports = function character_cmd(msg, args) {
    var who = msg.author;
    if(args.length > 1){
        who = args[1];
        if(who === 'null')
            who = null
    }

    var character = Character.find(who);
    if(args.length <=2){
        if(character === undefined) {
            msg.reply("Could not find a character for " + who);
        }
        else{
            msg.channel.send(helper.print_sheet(character))
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

            if(['c', 'create'].indexOf(option) > -1){
                if(args.length > 3){
                    character = helper.do_create_character(args[3], who);
                    msg.reply(helper.print_sheet(character))
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
