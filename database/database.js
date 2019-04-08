const Database = require('better-sqlite3')

const db = new Database('vtmv5.db');//, {verbose: console.log});

// Create the table if it doesn't exist
//const create = db.prepare('CREATE TABLE IF NOT EXISTS health (USER text UNIQUE NOT NULL, HEALTH INTEGER, SUPERFICIAL INTEGER DEFAULT 0, AGGRAVATED INTEGER DEFAULT 0)');
//create.run()
// Create the table if it doesn't exist
//const create = db.prepare('CREATE TABLE IF NOT EXISTS hunger (USER text UNIQUE NOT NULL, HUNGER INTEGER)');
//create.run()


const Character = require('./character.js')(db)

const hunger = require('./hunger.js')(db)
const health = require('./health.js')(db)


module.exports.hunger = hunger
module.exports.health = health
module.exports.Character = Character
