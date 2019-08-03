var step = require('./steps')
var database = require('../../database')

module.exports.CONVICTIONS_TOUCHSTONES = function(character,content,who){
    // Start by deleting all advantages in case this is being called a second time
    database.convictions.delete(character.id)
    var convictions = content.split(';')

    if(convictions.length > 3)
        return [step.CONVICTIONS_TOUCHSTONES,
                `You can select up to 3 convictions`]

    for(var i in convictions){
        var args = convictions[i].split(':')
        if(args.length != 2){
            return [step.CONVICTIONS_TOUCHSTONES,
                `Each conviction needs a touchstone, and only one touchstone, e.g. the guilty should suffer:Francis, a judge`]
        }
        character.add_conviction(args[0],args[1])
    }

    return [step.FINISH]
}

