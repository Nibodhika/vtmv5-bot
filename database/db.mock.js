const Database = require('better-sqlite3')

const db = new Database('testing.db',{memory:true});//, {verbose: console.log});

module.exports.creation = require('./creation.js')(db)
module.exports.rolls = require('./rolls.js')(db)

module.exports.character = require('./character.js')(db)
module.exports.hunger = require('./hunger.js')(db)
module.exports.health = require('./health.js')(db)
module.exports.willpower = require('./willpower.js')(db)
module.exports.powers = require('./powers.js')(db)
module.exports.specialities = require('./specialities.js')(db)
module.exports.advantages = require('./advantages.js')(db)
module.exports.thin_blood_adv = require('./thin_blood_adv.js')(db)
module.exports.convictions = require('./convictions.js')(db)
