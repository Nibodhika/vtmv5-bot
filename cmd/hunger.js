const database = require('../database/database.js');

// var admin = '<@295376593273225217>';

module.exports = function hunger(msg, args){
    var is_gm = msg.member.roles.some(r=>["GM"].includes(r.name));
    
    var who = msg.author;
    if(args.length > 1)
        who = args[1];

    if(args.length <=2){
        var hunger = database.hunger.get(who);
        var reply = ''
        if(hunger == undefined)
            reply = "No hunger information for " + who;
        else
            reply = who + " is at " + hunger + " Hunger";

        msg.channel.send(reply);
    }
    else {

        if(!is_gm){
            msg.reply("You can't do that");
        }
        else{
            var option = args[2];
            var amount = 1;
            if(args.length > 3)
                amount = Number(args[3])
            var changed = true;
            var current_hunger = undefined
            if(['i', 'inc', 'increase'].indexOf(option) > -1)
                current_hunger = database.hunger.increase(who, amount);
            else if(['d', 'dec', 'decrease'].indexOf(option) > -1)
                current_hunger = database.hunger.decrease(who, amount);
            else if(['s', 'set'].indexOf(option) > -1)
                current_hunger = database.hunger.set(who, amount);
            else{
                msg.reply("Unknown option " + option);
            }

            if(current_hunger != undefined){
                msg.channel.send(who + " is now at " + current_hunger + " Hunger");
            }
        }
    }
}
