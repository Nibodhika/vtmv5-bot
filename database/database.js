const Database = require('better-sqlite3')

const db = new Database('vtmv5.db', {verbose: console.log});

const hunger = require('./hunger.js')(db)
const health = require('./health.js')(db)


module.exports.hunger = hunger
module.exports.health = health
