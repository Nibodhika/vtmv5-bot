var helper = require('./character_base');
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
            
            conviction_fields = []
            for(var conviction in character.convictions){
                conviction_fields.push({
                    name: conviction,
                    value: character.convictions[conviction]
                })

            }

            msg.channel.send({
                embed:{
                    title: `Convictions and touchstones`,
                    description: `${who}`,
                    fields: conviction_fields
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
                    if(what.length != 2){
                        msg.reply("Give me <conviction>:<touchstone>")
                        return
                    }
                    var conviction = what[0]
                    var touchstone = what[1]
                    var reply = character.add_conviction(conviction,touchstone)
                    msg.reply(reply)
                }
                else{
                    msg.reply("add what?");
                }
            }
            else if(['r', 'remove'].indexOf(option) > -1){
                if(args.length > 3){
                    var conviction = args.slice(3).join(' ');
                    var reply = character.remove_conviction(conviction)
                    msg.reply(reply)
                }
                else{
                    msg.reply("remove what?");
                }
            }
            else{
                msg.reply("Unknown option " + option)
            }
        }
    }
}
