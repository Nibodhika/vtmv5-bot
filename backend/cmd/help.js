const rules = require('../rules');
const Character = require('../models/character')

const Help = require('../models/help')

var help_str = `Valid commands are:
!help [topic] [specification]
    Prints this help, or help on a specific topic, try !help topics to see a list of available topics
!roll [amount=1] [difficulty=1]
    Rolls [amount] of dice
!reroll <type or values>
    Spends a willpower to reroll by type or values, "!help reroll" for more information
!hunger [who=author]
    Check the hunger of a player
!willpower [who=author]
    Check the willpower of a player
!health [who=author]
    Check the health of a player
!character [who=author]
    Check the character sheet of a player
!convictions [who=author]
    List convictions and touchstones
!rouse [amount=1]
    Does a rouse check
!frenzy [difficulty=1]
    Does a frenzy test
!create
    Starts the character creation in a DM
!humanity [who=author]
`

function help_cmd(msg, args){
    var reply = help_str;
    var topic = args[1] || null;
    if(topic){
        var specification = args[2] || null;
        reply = Help.get(topic,specification); 
    }

    msg.reply(reply);
}

module.exports.help_cmd = help_cmd
module.exports.help_str = help_str
