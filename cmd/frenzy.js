const roll = require('./roll')
const Character = require('../character')
const database = require('../database')

module.exports = function(msg, args) {
    var who = msg.author
    
    var character = Character.find(who)

    if(character === undefined){
        msg.reply(`No character information for ${who}`)
        return 1
    }
    
    var third_humanity = Math.floor(character.sheet.humanity / 3)
    var amount = character.current_willpower() + third_humanity
    var difficulty = 1
    
    if(args.length > 1){
        difficulty = Number(args[1]);
        if(! Number.isInteger(difficulty)){
            var fail_msg = "Difficulty '" + args[1] + "' is not an integer"
            msg.reply(fail_msg);
            return 1
        }
    }

    var all_dice = roll.do_roll(amount)
    // Save roll to database, no hunger because frenzy test don't use hunger die
    database.rolls.set(who,all_dice,difficulty, 0)
    var result = roll.check_successes(all_dice, difficulty)

    if(result.success){
        if(result.critical){
            color = 65280;
            title = 'You avoid the frenzy'
            //description = "You succeed with outstanding results";
        }
        else{
            color = 33823
            title = 'You avoid the frenzy, but must take a turn to recompose'
            //description = "You succeed"
        }
    }
    else{
        color = 16711680
        title = 'You succumb to the frenzy'
    }

    var description = ""+all_dice
        
    msg.reply({embed: {
        color: color,
        title: title,
        description: description
    }})
}
