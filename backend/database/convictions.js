var rules = require('../rules')

module.exports = function(db){

    var CREATE = `
CREATE TABLE IF NOT EXISTS character_has_conviction(
conviction TEXT NOT NULL,
touchstone TEXT DEFAULT NULL,
character INTEGER NOT NULL,
FOREIGN KEY(character) REFERENCES character(id) ON DELETE CASCADE
)`
    const create_table = db.prepare(CREATE);
    create_table.run()

    const do_get = db.prepare('SELECT * FROM character_has_conviction WHERE character=?');
    const do_set = db.prepare('INSERT INTO character_has_conviction(conviction,touchstone,character) VALUES(?,?,?)')

    const DELETE = `DELETE FROM character_has_conviction WHERE character=?`
    const delete_character = db.prepare(DELETE);

    const DELETE_ONE = `DELETE FROM character_has_conviction WHERE character=? AND conviction=?`
    const delete_one = db.prepare(DELETE_ONE);
    
    function del(character_id){
        return delete_character.run(character_id)
    }

    function del_one(character_id, advantage){
        return delete_one.run(character_id,advantage)
    }

    function get(character_id){
        var out = {}
        var rows = do_get.all(character_id)
        for(var i in rows){
            var conviction = rows[i].conviction
            out[conviction] = rows[i].touchstone
        }
        return out
    }

    function set(character_id, advantage, specification=null){
        // TODO check if advantage exists
        do_set.run(advantage,specification,character_id)
    }

    function save(character_id, dict){
        for(var conviction in dict){
            var touchstone = dict[conviction]
            set(character_id, conviction, touchstone)
        }
    }

    return {
        get: get,
        set: set,
        delete: del,
        delete_one:del_one,
        save:save
    }
}
