var rules = require('../../rules')
var database = require('../../database')
var step = require('./steps')
var y_n_question = require('./helpers').y_n_question

module.exports.ADVANTAGES_MERIT = function(character,content,who){
    // Start by deleting all advantages in case this is being called a second time
    database.advantages.delete(character.sheet.id)
    var advantages = content.split(';')
    var total_used_points = 0
    for(var i in advantages){
        var args = advantages[i].split(':')
        var advantage_name = args[0]
        if(Object.keys(rules.advantages).indexOf(advantage_name) == -1){
            return [step.ADVANTAGES_MERIT,
                   `${advantage_name} is not a valid advantage`]
        }
        var advantage = rules.advantages[advantage_name]
        if(advantage.flaw)
            return [step.ADVANTAGES_MERIT,
                    `${advantage_name} is a flaw, select only merits now`]

        var points = advantage.points[0]
        if(args.length > 1){
            points = Number(args[1])
            if( advantage.points.indexOf(points) == -1){
                return [step.ADVANTAGES_MERIT,
                    `${args[1]} is not a valid number of points for ${advantage_name}`]
            }
        }
        var specification = ''
        if(args.length > 2)
            specification = args[2]
        
        character.add_advantage(advantage_name,points,specification)
        total_used_points += points
    }

    if(total_used_points > 7){
        return [step.ADVANTAGES_MERIT,
                `You can only use 7 points at most, you used ${total_used_points}`]
    }
        
    else if(total_used_points < 7)
        return [step.ADVANTAGES_MERIT_CONFIRM_UNSPENT]
    return [step.ADVANTAGES_FLAWS]
}

module.exports.ADVANTAGES_MERIT_CONFIRM_UNSPENT = function(character,content,who){
    return y_n_question(content,
                        () => {
                            return [step.ADVANTAGES_FLAWS]
                        },
                        () => {
                            // No need to delete them here, as they will be deleted first thing on the advantages merit step
                            return [step.ADVANTAGES_MERIT,
                                    "Ok, let's try advantages step again, all your advantages have been deleted"]
                        },
                        step.ADVANTAGES_MERIT_CONFIRM_UNSPENT
                       )
}

module.exports.ADVANTAGES_FLAWS = function(character,content,who){
    // Start by deleting all flaws in case this is being called a second time
    for(var adv in character.advantages){
        var advantage = rules.advantages[adv]
        if(advantage.flaw)
            database.advantages.delete_one(character.sheet.id, adv)
    }

    var advantages = content.split(';')
    var total_used_points = 0
    for(var i in advantages){
        var args = advantages[i].split(':')
        var advantage_name = args[0]
        if(Object.keys(rules.advantages).indexOf(advantage_name) == -1){
            return [step.ADVANTAGES_FLAWS,
                   `${advantage_name} is not a valid advantage`]
        }
        var advantage = rules.advantages[advantage_name]
        if(! advantage.flaw)
            return [step.ADVANTAGES_FLAWS,
                    `${advantage_name} is a merit, select only flaws now`]

        var points = advantage.points[0]
        if(args.length > 1){
            points = Number(args[1])
            if( advantage.points.indexOf(points) == -1){
                return [step.ADVANTAGES_FLAWS,
                    `${args[1]} is not a valid number of points for ${advantage_name}`]
            }
            
        }
        var specification = ''
        if(args.length > 2)
            specification = args[2]
        
        character.add_advantage(advantage_name,points,specification)
        total_used_points += points
    }

    if(total_used_points < 2){
        return [step.ADVANTAGES_FLAWS,
                `You need to select at least 2 points, you used ${total_used_points}`]
    }
    else if(total_used_points > 2)
        return [step.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT]

    if(character.sheet.clan == 'thin_blood')
        return [step.THIN_BLOOD_MERITS]
    return [step.CONVICTIONS_TOUCHSTONES]
}

module.exports.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT = function(character,content,who){
    return y_n_question(content,
                        () => {
                            if(character.sheet.clan == 'thin_blood')
                                return [step.THIN_BLOOD_MERITS]
                            return [step.CONVICTIONS_TOUCHSTONES]
                        },
                        () => {
                            // No need to delete them here, as they will be deleted first thing on the advantages merit step
                            return [step.ADVANTAGES_FLAWS,
                                    "Ok, let's try flaws step again, all your flaws have been deleted"]
                        },
                        step.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT
                       )    
}
