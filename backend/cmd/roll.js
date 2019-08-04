const Character = require('../models/character');
const database = require('../database')

function do_roll(amount){
    var dice = [];
    for(var i = 0; i < amount; i++) {
        var die = Math.floor((Math.random() * 10) + 1)
        dice.push(die);
    }
    return dice
}

function check_successes(all_dice, difficulty, hunger=0){
    result = {
        dice: [],
        hunger_dice: [],
        successes: 0,
        margin: 0,
        success:false,
        critical: false,
        messy: false,
        bestial: false,
    }
    var tens = 0
    
    
    for(var i in all_dice){
        var die = all_dice[i]
        if(die > 5){
            result.successes++;
            if(die == 10)
                tens++;
        }
        if(i < hunger){
            result.hunger_dice.push(die);
            if(die == 10)
                result.messy = true;
            else if(die == 1)
                result.bestial = true;
        }
        else
            result.dice.push(die);
    }

    var criticals = Math.floor(tens / 2);
    result.successes += criticals * 2;
    // Can't be a messy if it's not a critical
    if(criticals == 0){
        result.messy = false
        result.critical = false
    }
    else{
        result.critical = true
    }
        
    // Can't be a bestial if it's not a failure
    if(result.successes >= difficulty){
        result.success = true
        result.bestial = false
        result.margin = result.successes - difficulty
    }
    // Failure
    else{
        result.margin = difficulty - result.successes
    }

    return result
}

function print_roll(all_dice, difficulty, hunger) {

    var result = check_successes(all_dice, difficulty, hunger)
    
    var margin = 0;
    var title = "";
    var color = 0;
    var description = all_dice.length + "d10 vs " + difficulty + " with " + hunger + " Hunger.";
    if(result.success){
        if(result.critical){
            if(result.messy){
                color = 16749056;
                title = 'Messy Critical!'
                //description = "Not you, but the beast succeeds";
            }   
            else{
                color = 65280;
                title = 'Critical Success!'
                //description = "You succeed with outstanding results";
            }
        }
        else{
            color = 33823
            title = 'Success'
            //description = "You succeed"
        }
    }
    else{
        if(result.bestial)
        {
            color = 16711680
            title = 'Bestial Failure!'
            //description = 'You fail, and either the Beast gets angry at you, or it manifested and made you fail'
        }
        else
        {
            color = 0
            title = 'Failure'
            //description = 'You fail'
        }
    }

    fields = [
        {
            name: "Margin",
            value: "Successes: " + result.successes +"\nMargin: " + result.margin,
        }
    ];
    if(hunger > 0)
        fields.push({
                name: "Hunger Dice",
                value: "" + result.hunger_dice,
        });

    if(result.dice.length >0)
        fields.push({
            name: "Dice",
            value: "" + result.dice,
        });

    return {embed: {
        color: color,
        title: title,
        description: description,
        fields: fields
    }};
}

function cmd(msg, args) {
    var who = msg.author;
    var amount = 1;
    var difficulty = 1;
    var character = Character.find(who);
    var hunger = 0

    if(character != undefined)
        hunger = character.hunger;    
    
    if(args.length > 1){
        amount = Number(args[1]);
        if(! Number.isInteger(amount)){
            var fail_msg = "Amount '" + args[1] + "' is not an integer or a valid roll"
            if(character == undefined){
                msg.reply(fail_msg);
                return 1
            }
            
            // Not an integer, and there is a character maybe a characteristic
            amount = 0
            // Replace - with +- so that str-2 becomes str+-2
            // which gets split into [str, -2], which will perform the correct sum for the amount of dice
            var pool = args[1].replace('-','+-').split("+")
            
            for(var i = 0; i < pool.length; i++){
                var partial = character.get(pool[i])
                if(partial === undefined){
                    partial = Number(pool[i])
                    if(! Number.isInteger(partial)){
                        msg.reply(fail_msg);
                        return 1;
                    }
                }
                amount += partial
            }
        }
    }

    if(args.length > 2){
        difficulty = Number(args[2]);
        if(! Number.isInteger(difficulty)){
            msg.reply("Difficulty '" + args[2] + "' is not an integer");
            return 1;
        }
    }

    if(args.length > 3){
        var is_gm = msg.member.roles.some(r=>["GM"].includes(r.name));
        if(is_gm){
            hunger = Number(args[3]);
            if(! Number.isInteger(hunger)){
                msg.reply("Hunger '" + args[3] + "' is not an integer");
                return 1;
            }
        }
            
        else{
            msg.reply("You can't set the hunger on a roll");
            return 1;
        }
    }

    // Always minimum 1 dice
    if(amount < 1)
        amount = 1
    var all_dice = do_roll(amount)
    // Save roll to database
    database.rolls.set(who,all_dice,difficulty, hunger)

    msg.reply(print_roll(all_dice, difficulty, hunger));

    return 0;
}


module.exports.cmd = cmd
module.exports.do_roll = do_roll
module.exports.print_roll = print_roll
module.exports.check_successes = check_successes
