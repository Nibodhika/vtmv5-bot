var rules = require('../rules')

module.exports = function(db){

    var CREATE = `
CREATE TABLE IF NOT EXISTS character_has_advantage(
advantage TEXT NOT NULL,
points INTEGER NOT NULL,
specification TEXT DEFAULT NULL,
character INTEGER NOT NULL,
FOREIGN KEY(character) REFERENCES character(id) ON DELETE CASCADE
)`
    const create_table = db.prepare(CREATE);
    create_table.run()

    const do_get = db.prepare('SELECT * FROM character_has_advantage WHERE character=?');
    const do_set = db.prepare('INSERT INTO character_has_advantage(advantage,points,specification,character) VALUES(?,?,?,?)')

    const DELETE = `DELETE FROM character_has_advantage WHERE character=?`
    const delete_character = db.prepare(DELETE);

    const DELETE_ONE = `DELETE FROM character_has_advantage WHERE character=? AND advantage=?`
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
            var advantage = rows[i].advantage
            out[advantage] = {
                points: rows[i].points,
                specification: rows[i].specification,
            }
        }
        return out
    }

    function set(character_id, advantage, points, specification=null){
        // TODO check if advantage exists
        do_set.run(advantage,points,specification,character_id)
    }

    function save(character_id, dict){
        for(var advantage in dict){
            var adv = dict[advantage]
            set(character_id, advantage, adv.points, adv.specification)
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
