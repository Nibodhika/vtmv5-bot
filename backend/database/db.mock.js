const Database = require('better-sqlite3')

const db = new Database('testing.db',{memory:true});//, {verbose: console.log});

module.exports = require('./database')(db)
