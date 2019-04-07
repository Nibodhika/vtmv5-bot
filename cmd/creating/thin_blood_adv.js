var step = require('./steps')
var rules = require('../../rules')
var database = require('../../database')

module.exports.THIN_BLOOD_MERITS = function(character,content,who){
    // Start by deleting all advantages in case this is being called a second time
    database.thin_blood_adv.delete(character.sheet.id)

    var advantages = content.split(';')
    if(advantages.length > 3)
        return [step.THIN_BLOOD_MERITS,
                `You can select up to 3 merits`]
    
    for(var i in advantages){
        var args = advantages[i].split(':')
        var advantage_name = args[0]
        if(Object.keys(rules.thin_blood_adv).indexOf(advantage_name) == -1){
            return [step.THIN_BLOOD_MERITS,
                    `${advantage_name} is not a valid thin blood advantage`]
        }
        var advantage = rules.thin_blood_adv[advantage_name]
        if(advantage.flaw)
            return [step.THIN_BLOOD_MERITS,
                    `${advantage_name} is a flaw, select only merits now`]

        var specification = ''
        if(args.length > 1)
            specification = args[1]

        character.add_thin_blood_adv(advantage_name,specification)
    }

    return [step.THIN_BLOOD_FLAWS]
}

module.exports.THIN_BLOOD_FLAWS = function(character,content,who){
    // Start by deleting all flaws in case this is being called a second time
    counter = 0
    for(var adv in character.thin_blood_adv){
        var advantage = rules.thin_blood_adv[adv]
        if(advantage.flaw)
            database.thin_blood_adv.delete_one(character.sheet.id, adv)
        else
            counter +=1
    }

    var advantages = content.split(';')
    if(advantages.length != counter)
        return [step.THIN_BLOOD_FLAWS,
                `You need to select ${counter} flaws, the same amount of merits you selected`]
    
    for(var i in advantages){
        var args = advantages[i].split(':')
        var advantage_name = args[0]
        if(Object.keys(rules.thin_blood_adv).indexOf(advantage_name) == -1){
            return [step.THIN_BLOOD_FLAWS,
                    `${advantage_name} is not a valid thin blood advantage`]
        }
        var advantage = rules.thin_blood_adv[advantage_name]
        if(!advantage.flaw)
            return [step.THIN_BLOOD_FLAWS,
                    `${advantage_name} is a merit, select only flaws now`]

        var specification = ''
        if(args.length > 1)
            specification = args[1]

        character.add_thin_blood_adv(advantage_name,specification)
    }

    return [step.CONVICTIONS_TOUCHSTONES]
}
