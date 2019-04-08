const database = require('../database/database.js');
var helper = require('./character_base.js');

function step_0(msg){
    var character = database.Character.find(msg.author);
    var reply = ""
    if(character === undefined) {
        msg.author.send("Welcome to the character creation helper");
        return step_2(msg);
    }

    msg.author.send(`You already have a character named ${character.sheet.name}, proceeding with this will delete it, do you wish to proceed? y/n `);
    console.log("will return 1")
    return 1;
}
function step_1(msg){
    if(['y', 'yes'].indexOf(msg.content.toLowerCase()) > -1){
        return step_2(msg);
    }
    else if(['n', 'no'].indexOf(msg.content.toLowerCase()) > -1){
        msg.author.send("Aborting character creation");
        return -1;
    }

    msg.author.send(msg.content + " is not a valid response");
    return 1;
}

function step_2(msg){
    msg.author.send("First tell me what's your character name");
    return 3;
}

function step_3(msg){
    character = helper.do_create_character(msg.content, msg.author);
    msg.reply("Created character " + character.sheet.name + ", you can see his sheet by sending !character");
    return 4;
}

function step_4(msg){
    msg.author.send("finished creation");
    return -1;
}

module.exports = function creating_cmd(msg, step){
    switch(step){
    case 0:
        return step_0(msg);
    case 1:
        return step_1(msg);
    case 2:
        return step_2(msg);
    case 3:
        return step_3(msg);
    case 4:
        return step_4(msg);
    default:
        msg.author.send("It seems you are not creating a character yet, first send the !create command")
    }
    return -1;
}
