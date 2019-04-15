const rules = require('../rules/rules.js');

var help_str = `Valid commands are:
!help <topic>
    Prints this help
!roll <amount> <difficulty> <hunger>
    Rolls <amount> of dice
!hunger <who>
    Check the hunger of a player
!character <who>
    Check the character sheet of a player
!create
    Starts the character creation in a DM
`

function help_cmd(msg, args){
    var reply = help_str
    if(args.length > 1) {
        var about = args[1]
        if(about == 'clans'){
            reply = "The clan represents the vampire bloodline, available clans are:\n"
            for(var clan in rules.clans){
                reply += '- ' + clan + '\n'
            }
        }
        else if(Object.keys(rules.clans).indexOf(about) > -1){
            var clan = rules.clans[about]
            reply = clan.description
            if(clan == 'thin_blood'){
                reply += "\nThin blood don't have clan disciplines but instead have access to " + clan.disciplines
            }
            else if(clan == 'caitiff'){
                reply += '\nCaitiff can pick any two disciplines, but they count as non-clan for xp purchase cost'
            }
            else{
                reply += '\nClan disciplines are '+clan.disciplines
            }
        }
        else if(Object.keys(rules.disciplines).indexOf(about) > -1){
            var reply = rules.disciplines[about].description;
        }
        else if(Object.keys(rules.attributes).indexOf(about) > -1){
            var reply = rules.attributes[about].description;
            reply += `\nYou can also refer to it for rolls and character creation as: ` + rules.attributes[about].alias
        }
        else if(Object.keys(rules.skills).indexOf(about) > -1){
            var reply = rules.skills[about].description;
        }
        else if(Object.keys(rules.predator_type).indexOf(about) > -1){
            var reply = rules.predator_type[about].description;
        }
        else{
            reply = `I don't know about "${about}"`
        }
    }
    msg.reply('\n'+reply);
}

module.exports.help_cmd = help_cmd
