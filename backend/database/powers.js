var rules = require('../rules')

module.exports = function(db){

    var CREATE = `
CREATE TABLE IF NOT EXISTS character_has_power(
power TEXT NOT NULL,
character INTEGER NOT NULL,
FOREIGN KEY(character) REFERENCES character(id) ON DELETE CASCADE
)`
    const create_table = db.prepare(CREATE);
    create_table.run()

    const do_get = db.prepare('SELECT * FROM character_has_power WHERE character=?');
    const do_set = db.prepare('INSERT INTO character_has_power(power, character) VALUES(?,?)')

    const DELETE = `DELETE FROM character_has_power WHERE character=?`
    const delete_character = db.prepare(DELETE);
    function del(character_id){
        return delete_character.run(character_id)
    }

    function get(character_id){
        var out = []
        var rows = do_get.all(character_id)

        for(var i in rows){
            var power = rows[i].power
            out.push(power)
        }
        return out
    }

    function set(character_id, power){
        // TODO check if power exists and if character has the prerequisits
        do_set.run(power, character_id)
    }

    function save(character_id, list){
        for(var i in list){
            var power = list[i]
            set(character_id,power)
        }
    }

    return {
        get: get,
        set: set,
        delete: del,
        save:save
    }
}
