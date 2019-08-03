const Database = require('better-sqlite3')

const db = new Database('vtmv5.db');//, {verbose: console.log});

exports = require('./database')(db)

module.exports = exports
