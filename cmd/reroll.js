const database = require('../database')
const roll = require('./roll')
const Character = require('../character')

module.exports = function(msg, args) {
    var who = msg.author;

    var prev = database.rolls.get(who)
    if(prev === undefined){
        msg.reply("You haven't yet rolled anything")
        return
    }
    // Split the roll into dice and hunger_dice
    hunger_dice = prev.dice.slice(0,prev.hunger)
    dice = prev.dice.slice(prev.hunger, prev.dice.length)

    var reroll_types = {
        'fail' : {
            description: 'Rerolls all failed, i.e. <= 5 dice',
            values: [1,2,3,4,5]
        },
        'tens': {
            description: 'Rerolls all 10s, useful to avoid a messy critical',
            values: [10]
        },
        'nontens': {
            description: 'Reroll all non 10s, useful when needing much more sucesses',
            values: [1,2,3,4,5,6,7,8,9]
        },
        'messy': {
                description: 'Rerolls all 10s and failures, useful when you rolled  a messy but still need more successes',
                values: [1,2,3,4,5,10]
        }
    }

    types = ['fail']
    if(args.length > 1)
        types = args[1].split(new RegExp('[,|+]','g'))

    dice_to_reroll = new Set()
    for(i in types){
        var type = types[i]
        var type_n = Number(type)
        if(type in reroll_types) {
            var values = reroll_types[type].values
            for(v in values){
                dice_to_reroll.add(values[v])
            }
        }
        else if(isNaN(type_n)){
            var reply = `Unknown reroll value or type ${type}, valid types are:`
            for(type in reroll_types)
                reply += '\n- ' + type + ': ' + reroll_types[type].description
            msg.reply(reply)
            return 1
        }
        else
            dice_to_reroll.add(type_n)
    }
    var character = Character.find(who)
    // If we have a character damage his willpower
    if(character != undefined){
        if(character.current_willpower() <= 0){
            msg.reply("Your character has no willpower left, and can't reroll dice")
            return 1
        }
        // Damage willpower before proceeding
        database.willpower.superficial_damage(who,1)
    }
    

    keep = []
    reroll_amount = 0
    for(i in dice){
        if(reroll_amount < 3 && dice_to_reroll.has(dice[i])){
            reroll_amount++
        }
        else
            keep.push(dice[i])
    }
    
    new_dice = roll.do_roll(reroll_amount)
    all_dice = hunger_dice.concat(keep).concat(new_dice)
    // Save new roll to database
    database.rolls.set(who,all_dice,prev.difficulty, prev.hunger)
    msg.reply(roll.print_roll(all_dice,prev.difficulty,prev.hunger))
}
