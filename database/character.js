var rules = require('../rules')

module.exports = function(db) {

    var CREATE = `
CREATE TABLE IF NOT EXISTS character(
id INTEGER PRIMARY KEY,
-- General
name TEXT UNIQUE NOT NULL,
player TEXT UNIQUE,
concept TEXT,
predator TEXT,
sire TEXT,
clan TEXT,
generation INTEGER,
resonance TEXT,
blood_potency INTEGER DEFAULT 0 CHECK( blood_potency >= 0 AND blood_potency <= 10),
desire TEXT,
ambition TEXT,
xp INTEGER,
`

    CREATE += '-- Attributes\n'
    for(var attr in rules.attributes){
        CREATE += `${attr} INTEGER DEFAULT 0 CHECK( ${attr} >= 0 AND ${attr} <= 5),\n`
    }
    CREATE += '\n-- Skills\n'
    for(var skill in rules.skills){
        CREATE += `${skill} INTEGER DEFAULT 0 CHECK( ${skill} >= 0 AND ${skill} <= 5),\n`
    }
    CREATE += '\n-- Disciplines\n'
    for(var skill in rules.disciplines){
        CREATE += `${skill} INTEGER DEFAULT 0 CHECK( ${skill} >= 0 AND ${skill} <= 5),\n`
    }

    CREATE += `
-- hunger
hunger INTEGER DEFAULT 1 CHECK( hunger >= 0 AND hunger <= 5),
-- health
health INTEGER NOT NULL DEFAULT 0 CHECK( health >= 0 AND health <= 10),
h_superficial INTEGER DEFAULT 0,
h_aggravated INTEGER DEFAULT 0,
-- willpower
willpower INTEGER NOT NULL DEFAULT 0 CHECK( willpower >= 0 AND willpower <= 10),
w_superficial INTEGER DEFAULT 0,
w_aggravated INTEGER DEFAULT 0,
-- humanity
humanity INTEGER NOT NULL DEFAULT 0 CHECK( humanity >= 0 AND humanity <= 10),
stains INTEGER DEFAULT 0)`

    
    const create_character_table = db.prepare(CREATE);
    create_character_table.run()


    var INSERT = 'INSERT INTO character(name,player) VALUES(?,?)'
    const insert = db.prepare(INSERT)
    
    var SAVE = 'UPDATE character SET name=@name, player=@player, concept=@concept, predator=@predator, sire=@sire, clan=@clan, generation=@generation, resonance=@resonance,desire=@desire,ambition=@ambition,xp=@xp, '
    for(var attr in rules.attributes){
        SAVE += `${attr}=@${attr}, `
    }
    for(var skill in rules.skills){
        SAVE += `${skill}=@${skill}, `
    }
    for(var discipline in rules.disciplines){
        SAVE += `${discipline}=@${discipline}, `
    }
    SAVE += ' hunger=@hunger, health=@health, h_superficial=@h_superficial, h_aggravated=@h_aggravated, willpower=@willpower, w_superficial=@w_superficial, w_aggravated=@w_aggravated, humanity=@humanity, stains=@stains WHERE id=@id'

    const save_character_prep = db.prepare(SAVE);
    const save_character_transaction = db.transaction((character) => {
        return save_character_prep.run(character);
    });

    function save_character(character){
        if(character.id === null){
            var out = insert.run(character.name, character.player)
            character.id = out['lastInsertRowid']
        }
        save_character_transaction(character)
        return character.id
    }
    
    const load_character = db.prepare(`SELECT * FROM character WHERE name=?`);
    const find_character = db.prepare(`SELECT * FROM character WHERE player=?`);

    function find(player){
        player = String(player);
        return find_character.get(player);
    }

    function load(name){
        return load_character.get(name);
    }

    const DELETE = `DELETE FROM character WHERE ID=?`
    const delete_character = db.prepare(DELETE);
    function del(character_id){
        return delete_character.run(character_id)
    }

    return{
        save: save_character,
        get: load,
        find: find,
        delete: del
    }
}
