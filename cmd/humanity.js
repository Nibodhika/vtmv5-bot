var Character = require('../models/character')
var base = require('./character_base')
var roll = require('./roll')
var rules = require('../rules')

function get_output(character){
    var reply = `Humanity ${character.humanity}/${10-character.humanity-character.stains}/${character.stains}\n${base.build_humanity_bar(character)}`
    return reply
}

function get_humanity_characteristics(humanity_level){
    var reply = ""
    var humanity_rules = rules.humanity[humanity_level]
    for(var i in humanity_rules){
        reply += '\n- ' + humanity_rules[i]
    }
    return reply
}

module.exports = function(msg, args) {

    var who = msg.author;
    if(args.length > 1){
        who = args[1];
    }

    var character = Character.find(who)
    if(character === undefined){
        msg.channel.send(`No humanity information for ${who}`);
        return;
    }
    if(args.length <=2){
        var reply = `${who} is at `
        reply += get_output(character)
        msg.channel.send(reply);
    }
    else {
        var is_gm = msg.member.roles.some(r=>["GM"].includes(r.name));
        if(! is_gm){
            msg.reply("You can't do that");
        }
        else{
            var option = args[2];
            var amount = 1
            if(args.length > 3){
                amount = Number(args[3])
                if(isNaN(amount)){
                    msg.reply(`${args[3]} is not a number`)
                    return
                }
            }
            var reply = ''
            
            if(['stains'].indexOf(option) > -1){
                // Add stains
                character.stains += amount
                
                // Check degeneration
                var free_boxes = 10-character.humanity-character.stains
                if(free_boxes < 0){
                    var w_damage = free_boxes * -1
                    character.stains = 10-character.humanity
                    character.w_aggravated += w_damage
                    reply = `${who} has suffer degeneration and taken ${w_damage} point(s) of aggravated willpower damage and is now Impaired (page 239)\n`
                }
                else
                    reply = `${who} is now at `

                character.save()
                reply += get_output(character)
            }
            else if(['remorse'].indexOf(option) > -1){
                if(character.stains == 0){
                    reply = `No remorse check needed for ${who}\n He stays at Humanity ${character.humanity}`

                }
                else{
                    // Perform remorse check
                    var free_boxes = 10-character.humanity-character.stains
                    if(free_boxes <= 0)
                        free_boxes = 1
                    var dice = roll.do_roll(free_boxes)
                    // This test does not use hunger
                    var result = roll.check_successes(dice,1,0)
                    if(result.success){
                        character.stains = 0
                        reply = `${who} succeeds his remorse check and stays at Humanity ${character.humanity}\nDice: ${dice}`
                    }
                    else{
                        character.humanity--
                        character.stains = 0
                        reply = `${who} failed his remorse check and is now at Humanity ${character.humanity}\nDice: ${dice}\nYour new level of humanity has the following characteristics:${get_humanity_characteristics(character.humanity)}`
                    }
                    character.save()    
                }
                
            }
            else if(['rationalize'].indexOf(option) > -1){
                // Player rationalizes actions and loses a point in humanity
                character.humanity--
                character.stains = 0
                reply = `${who} rationalizes the monster he's become and is now at Humanity ${character.humanity} and no longer Impaired\nYour new level of humanity has the following characteristics:${get_humanity_characteristics(character.humanity)}`
                character.save()
            }
            else{
                msg.reply("Unknown option " + option);
                return
            }
            msg.channel.send(reply)
        }
    }
}
