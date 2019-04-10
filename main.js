const Discord = require('discord.js');
const client = new Discord.Client();

// commands
const help_cmd = require('./cmd/help.js').help_cmd;
const roll_cmd = require('./cmd/roll.js');
const hunger_cmd = require('./cmd/hunger.js');
const health_cmd = require('./cmd/health.js');
const character_cmd = require('./cmd/character.js');
const creating_cmd = require('./cmd/creating.js');

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
        if(cmd === 'help')
            help_cmd(msg, args)
        else if(cmd === 'roll')
            roll_cmd(msg, args);
        else if(cmd === 'hunger')
            hunger_cmd(msg, args);
        else if(cmd === 'health')
            health_cmd(msg, args);
        else if(cmd === 'character')
            character_cmd(msg, args)
        else if(cmd === 'create'){
            creating_cmd(msg, true);
        }
        else{
            msg.reply("\nUnknown command, " + help_str);
        }
    }
    else if(msg.channel.name === undefined && ! msg.author.bot) {
        creating_cmd(msg, false);
    }

});



client.login('NTY0NDAzNDM1MjUzMDA2MzQ2.XKnX0A.5mYlgxaWElUt9e6THJrd6OL5o5g');
