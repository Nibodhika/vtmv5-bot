const Discord = require('discord.js');
const client = new Discord.Client();

// commands
var commands = require('./cmd')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    if (msg.content[0] === '!') {
        // Remove double spaces
        var command = msg.content.trim().substring(1).replace(/\s\s+/g, ' ').toLowerCase();
        // Split the spaces
        var args = command.split(' ');
        var cmd = args[0];

        if( Object.keys(commands).indexOf(cmd) > -1){

            if(cmd === 'create'){
                commands[cmd](msg, true);
            }
            else{
                commands[cmd](msg, args)
            }
        }
        else{
            msg.reply("\nUnknown command " + cmd +" you can get a list of commands using !help");
        }
    }
    else if(msg.channel.name === undefined && ! msg.author.bot) {
        commands['create'](msg, false);
    }

});    


module.exports = function(config){
    return client.login(config.token);    
}


    
