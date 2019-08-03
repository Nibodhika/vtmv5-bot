const Character = require('../models/character')
const roll = require('./roll')

module.exports = function(msg, args){
    var who = msg.author;
    
    var character = Character.find(who);

    if(character == undefined){
        msg.reply(`No character information for ${who}`);
        return 1
    }

    var amount = 1
    if(args.length > 1){
        amount = Number(args[1]);
        if(! Number.isInteger(amount)){
            var fail_msg = "Amount '" + args[1] + "' is not an integer"
            msg.reply(fail_msg);
            return 1
        }
    }

    dice = roll.do_roll(amount)

    successes = 0
    for(var i in dice){
        var die = dice[i]
        if(die > 5)
            successes++;
    }

    description = `Your hunger stays the same`
    reply = 'Success'
    color = 33823
    if(successes == 0){
        color = 0
        reply = 'Failure'
        if(character.sheet.hunger >= 5){
            color = 16711680
            if(character.sheet.clan != 'thin_blood')
                description = `Make a Hunger Frenzy test with difficulty 4 or ride the wave`
            else
                description = `You would enter a hunger frenzy, if your blood weren't so thin`
        }
        else{
            character.sheet.hunger++
            character.save()
            description = `Your hunger increases to ${character.sheet.hunger}`
        }
    }

    msg.reply({
        embed: {
            color: color,
            title: reply,
            description: description,
            fields:[
                {
                    name: "Dice",
                    value: ""+dice
                }
            ]
        }
    })
}
