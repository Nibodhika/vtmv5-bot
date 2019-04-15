var rules = require('../rules/rules.js')

module.exports = function(db){

    var CREATE = `
CREATE TABLE IF NOT EXISTS character_has_power(
power TEXT NOT NULL,
character INTEGER,
FOREIGN KEY(character) REFERENCES character(id)
)`
    const create_table = db.prepare(CREATE);
    create_table.run()

    const do_get = db.prepare('SELECT * FROM character_has_power WHERE character=?');
    const do_set = db.prepare('INSERT INTO character_has_power(power, character) VALUES(?,?)')


    function get(character){
        var character_id = character.sheet['id']
        var rows = do_get.get(character_id)
        if(rows === undefined)
            return rows
        console.log("rows is: ", rows)
    }

    function set(character, power){
        var character_id = character.sheet['id']
        // TODO check if power exists and if character has the prerequisits
        do_set.run(power, character_id)
    }
    
}
