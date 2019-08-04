var database = require('../database')
var base = require('./character_base')

function get_output(who){
    var willpower = database.willpower.get(who);
    var reply = ''
    if(willpower == undefined)
        reply = "No willpower information for " + who;
    else{
        var willpower_bar = base.build_willpower_bar(willpower)
        reply = who + " is at " + willpower_bar.remaining + "/" + willpower_bar.life + " Willpower\n" + willpower_bar.bar;
    }
    return reply
}

module.exports = function(msg, args) {
    // !willpower <who> <option> <amount> <type>
    var who = msg.author;
    if(args.length > 1)
        who = args[1];
    
    if(args.length <=2){
        var reply = get_output(who)
        msg.channel.send(reply);
    }
    else {
        var is_gm = msg.member.roles.some(r=>["GM"].includes(r.name));
        if(! is_gm){
            msg.reply("You can't do that");
        }
        else{
            var option = args[2];

            var types = {
                superficial: {
                    names: ['superficial', 's'],
                    set: database.willpower.set_superficial,
                    damage: database.willpower.superficial_damage,
                    heal: database.willpower.heal_superficial
                },
                aggravated: {
                    names: ['aggravated', 'a'],
                    set: database.willpower.set_aggravated,
                    damage: database.willpower.aggravated_damage,
                    heal: database.willpower.heal_aggravated
                } 
            }
            
            var type_name = 'superficial'
            var type = undefined
            var amount = 1;

            if(args.length > 3)
                amount = Number(args[3])
            if(isNaN(amount)){
                msg.reply(`${args[3]} is not a number`)
                return
            }
            
            if(args.length > 4)
                type_name = args[4]
                        
            for(var t in types){
                var t2 = types[t]
                if(t2.names.indexOf(type_name) > -1){
                    type = t2
                }
            }

            if(type === undefined){
                msg.reply(`Unknown type ${type_name}, choose either superficial or aggravated`)
                return
            }

            
            if(['damage', 'd'].indexOf(option) > -1){
                type.damage(who,amount)
            }
            else if(['heal', 'h'].indexOf(option) > -1){
                type.heal(who,amount)
            }
            else if(['set', 's'].indexOf(option) > -1){
                type.set(who,amount)
            }
            else{
                msg.reply("Unknown option " + option);
                return
            }
            var reply = get_output(who)
            msg.reply(reply)
        }
    }
}
