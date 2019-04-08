const database = require('../database/database.js');



module.exports = function health(msg, args){
    var is_gm = msg.member.roles.some(r=>["GM"].includes(r.name));
    
    var who = msg.author;
    if(args.length > 1)
        who = args[1];
    
    if(args.length <=2){
        var health = database.health.get(who);
        var reply = ''
        if(health == undefined)
            reply = "No health information for " + who;
        else
            reply = who + " is at " + health[1] + "/" + health[0] + " Health";

        msg.channel.send(reply);
    }
    else {

        if(! is_gm){
            msg.reply("You can't do that");
        }
        else{
            var option = args[2];
            var amount = 1;
            if(args.length > 3)
                amount = Number(args[3])
            var changed = true;
            var current_health = undefined

            if(['a', 'set'].indexOf(option) > -1)
                current_health = database.health.increase(who, amount);
            else if(option === 'd')
                current_health = database.health.decrease(who, amount);
            else if(option === 's'){
                current_health = database.health.set_total(who, amount);
                current_health = database.health.set_current(who, amount);
            }
                
            else{
                msg.reply("Unknown option " + option);
            }
            console.log("Current health is " + current_health)

            if(current_health != undefined){
                msg.channel.send(who + " is now at " + current_health + " Health");
            }
        }
    }
}
