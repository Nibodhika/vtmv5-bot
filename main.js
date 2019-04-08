const Discord = require('discord.js');
const client = new Discord.Client();

// commands
const roll_cmd = require('./cmd/roll.js');
const hunger_cmd = require('./cmd/hunger.js');
const health_cmd = require('./cmd/health.js');
const character_cmd = require('./cmd/character.js');
const creating_cmd = require('./cmd/creating.js');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

var creating_step = -1

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
        if(cmd === 'help')
            msg.reply('\n'+help_str);
        else if(cmd === 'roll')
            roll_cmd(msg, args);
        else if(cmd === 'hunger')
            hunger_cmd(msg, args);
        else if(cmd === 'health')
            health_cmd(msg, args);
        else if(cmd === 'character')
            character_cmd(msg, args)
        else if(cmd === 'create'){
            console.log("Received a create command")
            creating_step = 0
            creating_step = creating_cmd(msg,creating_step)
        }
        else{
            msg.reply("\nUnknown command, " + help_str);
        }
    }
    else if(msg.channel.name === undefined && ! msg.author.bot) {
        console.log(msg.content + " sent with " + creating_step)
        var a = creating_cmd(msg,creating_step)
        console.log("creating called with " + creating_step + " returned " + a)
        creating_step = a
        console.log("After msg step is " + creating_step)
    }

});



client.login('NTY0NDAzNDM1MjUzMDA2MzQ2.XKnX0A.5mYlgxaWElUt9e6THJrd6OL5o5g');
