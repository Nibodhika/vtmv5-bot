const Discord = require('discord.js');
const client = new Discord.Client();

var database = require('./database')

// commands
var commands = require('./cmd')


function create_user_if_needed(member){
    // Don't create user for bots
    if(member.user.bot)
        return
    
    var discord_handle = `<@${member.user.id}>`
    var username = member.user.username
    var is_gm = member.roles.some(r=>["GM"].includes(r.name));

    // Use the handle, as the nick might have changed
    var user = database.user.find_by_handle(discord_handle);
    // No need to create the user, already exists
    if(user != undefined)
        return

    // Generate a random password
    var password = Math.random().toString(36).slice(-8);
    database.user.create(username,password,discord_handle, is_gm)
    // Send the password to the user via DM
    var message = `
Welcome to the game, you can get a list of commands by typing !help

I have created a user for you to access the web interface:
Login: ${username}
Password: ${password}

feel free to change them`
    member.user.send(message)

    
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Create user for each user that is already in the channel
    client.guilds.forEach(function(g){
        g.members.forEach(function(member){
            create_user_if_needed(member)
        })
    })
});

client.on('guildMemberAdd', member => {
    console.log(`${member.user.username} logged in`);
    create_user_if_needed(member)
})

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



