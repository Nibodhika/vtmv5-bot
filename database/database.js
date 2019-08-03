
function load_database(db){
    return {
        user: require('./user.js')(db),
        
        creation: require('./creation.js')(db),
        rolls: require('./rolls.js')(db),

        character: require('./character.js')(db),
        hunger: require('./hunger.js')(db),
        health: require('./health.js')(db),
        willpower: require('./willpower.js')(db),
        powers: require('./powers.js')(db),
        specialties: require('./specialties.js')(db),
        advantages: require('./advantages.js')(db),
        thin_blood_adv: require('./thin_blood_adv.js')(db),
        convictions: require('./convictions.js')(db), 
    }
}


module.exports = load_database
