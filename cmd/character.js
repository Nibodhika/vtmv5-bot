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
                    var name = args.slice(3).join(' ')
                    character = helper.do_create_character(name, who);
                    msg.reply("Created character " + character.sheet.name);
                }
                else
                    msg.reply("Forgot to give the character a name");
            }
            else if(['s', 'set'].indexOf(option) > -1){
                if(args.length > 4){
                    var what = args[3];
                    var value = args[4];
                    var error = character.set(what, value)
                    msg.reply(error)
                }
                else{
                    msg.reply("Set what to which value?");
                }
            }
            else if(['a', 'add'].indexOf(option) > -1) {
                if(args.length > 3){
                    var what = args[3];

                    var advantage = undefined
                    var is_thin_blood_adv = undefined
                    if(what in rules.advantages){
                        advantage = rules.advantages[what]
                        is_thin_blood_adv = false
                    }
                    else if(what in rules.thin_blood_adv){
                        advantage = rules.thin_blood_adv[what]
                        is_thin_blood_adv = true
                    }

                    if(advantage === undefined){
                        msg.reply(`${what} is neither an advantage nor a thin blood advantage`)
                        return 1
                    }

                    if(is_thin_blood_adv){
                        if(character.sheet.clan != 'thin_blood'){
                            msg.reply(`${character.sheet.name} is not thin blood, and can't have thin blood advantages`)
                            return 1
                        }
                        
                        var specification = ''
                        if(args.length > 4)
                            specification = args.slice(4).join(' ')
                        character.add_thin_blood_adv(what,specification)
                        if(specification == '')
                            msg.reply(`added ${what}`)
                        else
                            msg.reply(`added ${what}: ${specification}`)
                    }
                    else{

                        var points = advantage.points[0]
                        if(args.length > 4){
                            points = Number(args[4]);
                            if( advantage.points.indexOf(points) == -1){
                                msg.reply(`${args[4]} is not a valid number of points for ${what}`)
                                return 1
                            }
                        }
                        
                        var specification = ''
                        if(args.length > 5)
                            specification = args.slice(5).join(' ');

                        character.add_advantage(what,points,specification)
                        if(specification == '')
                            msg.reply(`added ${what} with ${points}`)
                        else
                            msg.reply(`added ${what} with ${points}: ${specification}`)
                    }
                }
                else{
                    msg.reply("add what?");
                }
            }
            else if(['r', 'remove'].indexOf(option) > -1){
                if(args.length > 3){
                    var what = args[3];
                    var reply = `${what} is neither an advantage nor a thin blood advantage`
                    if(what in rules.advantages)
                        reply = character.remove_advantage(what)
                    else if(what in rules.thin_blood_adv)
                        reply = character.remove_thin_blood_adv(what)
                    msg.reply(reply)
                }
                else{
                    msg.reply("remove what?");
                }
            }

        }
    }

}
