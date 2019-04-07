const Discord = require('discord.js');
const client = new Discord.Client();

const database = require('./database.js');
const roll = require('./roll.js');

var admin = '<@295376593273225217>';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if (msg.content[0] === '!') {
        // Remove double spaces
        var command = msg.content.substring(1).replace(/\s\s+/g, ' ');
        // Split the spaces
        var args = command.split(' ');
        var cmd = args[0].toLowerCase();

        // Help string
        var help_str = `Valid commands are:
!help
    Prints this help
!roll <amount> <difficulty> <hunger>
    Rolls <amount> of dice
!hunger <who>
    Check the hunger of a player
`
        if(cmd === 'help'){
            msg.reply('\n'+help_str);
        }
        else if(cmd === 'roll') {
            var amount = 1;
            var difficulty = 1;
            var hunger = 0;
            if(args.length > 1)
                amount = args[1];
            if(args.length > 2)
                difficulty = args[2];
            if(args.length > 3)
                hunger = args[3];
            msg.reply(roll(amount, difficulty, hunger));
        }
        else if(cmd === 'hunger') {
            var who = msg.author;
            if(args.length > 1)
                who = args[1];
            console.log("who is " + who)

            if(args.length <=2){
                var hunger = database.get_hunger(who);
                var reply = ''
                if(hunger == undefined)
                    reply = "No hunger information for " + who;
                else
                    reply = who + " is at " + hunger + " Hunger";

                msg.channel.send(reply);
            }
            else{
                if(msg.author != admin){
                    msg.reply("You can't do that");
                }
                else{
                    var option = args[2];
                    var amount = 1;
                    if(args.length > 3)
                        amount = Number(args[3])
                    var changed = true;
                    var current_hunger = undefined
                    if(option === 'i')
                        current_hunger = database.increase_hunger(who, amount);
                    else if(option === 'd')
                        current_hunger = database.decrease_hunger(who, amount);
                    else if(option === 's')
                        current_hunger = database.set_hunger(who, amount);
                    else{
                        msg.reply("Unknown option " + option);
                    }
                    console.log("Current hunger is " + current_hunger)

                    if(current_hunger != undefined){
                        msg.channel.send(who + " is now at " + current_hunger + " Hunger");                    
                    }
                }
            }
        }
        else{
            msg.reply("\nUnknown command, " + help_str);
        }
    }
});



client.login('NTY0NDAzNDM1MjUzMDA2MzQ2.XKnX0A.5mYlgxaWElUt9e6THJrd6OL5o5g');
