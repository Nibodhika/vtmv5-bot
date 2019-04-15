const Database = require('better-sqlite3')

const db = new Database('vtmv5.db', {verbose: console.log});

// Create the table if it doesn't exist
//const create = db.prepare('CREATE TABLE IF NOT EXISTS health (USER text UNIQUE NOT NULL, HEALTH INTEGER, SUPERFICIAL INTEGER DEFAULT 0, AGGRAVATED INTEGER DEFAULT 0)');
//create.run()
// Create the table if it doesn't exist
//const create = db.prepare('CREATE TABLE IF NOT EXISTS hunger (USER text UNIQUE NOT NULL, HUNGER INTEGER)');
//create.run()


module.exports.character = require('./character.js')(db)
module.exports.hunger = require('./hunger.js')(db)
module.exports.health = require('./health.js')(db)
module.exports.creation = require('./creation.js')(db)
module.exports.powers = require('./powers.js')(db)

