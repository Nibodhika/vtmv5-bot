const Character = require('../character')
var helper = require('./character_base.js');

module.exports = function(msg, args) {
    var who = msg.author
    if(args.length > 1){
        who = args[1];
        // Why?
        if(who === 'null')
            who = null
        // allow me to mean me
        else if(who == 'me')
            who = msg.author
    }
    
    var character = Character.find(who)

    if(character === undefined){
        msg.reply(`No character information for ${who}`)
        return 1
    }
    
    msg.reply(helper.print_status(character))
}
