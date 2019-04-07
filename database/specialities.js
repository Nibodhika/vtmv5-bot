var rules = require('../rules')

module.exports = function(db){

    var CREATE = `
CREATE TABLE IF NOT EXISTS character_has_speciality(
speciality TEXT NOT NULL,
skill TEXT NOT NULL,
character INTEGER NOT NULL,
FOREIGN KEY(character) REFERENCES character(id) ON DELETE CASCADE
)`
    const create_table = db.prepare(CREATE);
    create_table.run()

    const do_get = db.prepare('SELECT * FROM character_has_speciality WHERE character=?');
    const do_set = db.prepare('REPLACE INTO character_has_speciality(speciality,skill,character) VALUES(?,?,?)')


    const DELETE = `DELETE FROM character_has_speciality WHERE character=?`
    const delete_character = db.prepare(DELETE);
    function del(character_id){
        return delete_character.run(character_id)
    }

    const DELETE_ONE = `DELETE FROM character_has_speciality WHERE character=? AND speciality=?`
    const delete_one = db.prepare(DELETE_ONE);
    function del_one(character_id, speciality){
        return delete_one.run(character_id, speciality)
    }
    
    function get(character_id){
        var out = {}
        var rows = do_get.all(character_id)

        for(var i in rows){
            var skill = rows[i].skill
            if(!(skill in out)){
                out[skill] = []
            }
            out[skill].push(rows[i].speciality)
        }
        return out
    }

    function set(character_id, speciality, skill){
        do_set.run(speciality, skill, character_id)
    }
    
    function save(character_id, dict){
        // first delete all current entries for the character
        del(character_id)
        // and now put the new ones
        for(var skill in dict){
            set(character_id,dict[skill],skill)
        }
    }

    return {
        get: get,
        set: set,
        delete: del,
        delete_one: del_one,
        save:save
    }
}
