const Database = require('better-sqlite3')

const db = new Database('hunger.db'); // , {verbose: console.log});

const create_hunger = db.prepare('CREATE TABLE IF NOT EXISTS hunger (USER text UNIQUE NOT NULL, HUNGER INTEGER)');
create_hunger.run()

const do_get = db.prepare('SELECT HUNGER from hunger where USER=?');
const do_set = db.prepare('REPLACE into hunger (USER,HUNGER) VALUES (?,?)');

function get_hunger(user){
    var who = String(user)
    var rows = do_get.get(who)
    if(rows === undefined)
        return rows
    return rows['HUNGER'];
}

function set_hunger(user, value){
    var who = String(user)
    var amount = Number(value)
    var ret = do_set.run(who, amount)
    return amount
}

function increase_hunger(user, value){
    var current = get_hunger(user)
    var new_value = current + Number(value)
    return set_hunger(user, new_value)
}

function decrease_hunger(user, value){
    var current = get_hunger(user)
    var new_value = current - Number(value)
    return set_hunger(user, new_value)
}

module.exports.get_hunger = get_hunger
module.exports.increase_hunger = increase_hunger
module.exports.decrease_hunger = decrease_hunger
module.exports.set_hunger = set_hunger
