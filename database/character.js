var rules = require('../rules/rules.js')

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
hunger INTEGER DEFAULT 1,
-- health
health INTEGER NOT NULL,
h_superficial INTEGER DEFAULT 0,
h_aggravated INTEGER DEFAULT 0,
-- willpower
willpower INTEGER NOT NULL,
w_superficial INTEGER DEFAULT 0,
w_aggravated INTEGER DEFAULT 0,
-- humanity
humanity INTEGER NOT NULL,
stains INTEGER DEFAULT 0)`

    
    const create_character_table = db.prepare(CREATE);
    create_character_table.run()


    var SAVE = 'REPLACE INTO character(id, name, player, concept, predator, sire, clan, generation, '
    for(var attr in rules.attributes){
        SAVE += `${attr}, `
    }
    for(var skill in rules.skills){
        SAVE += `${skill}, `
    }
    for(var discipline in rules.disciplines){
        SAVE += `${discipline}, `
    }
    SAVE += ' hunger, health, h_superficial, h_aggravated, willpower, w_superficial, w_aggravated, humanity, stains) VALUES(@id, @name, @player, @concept, @predator, @sire, @clan, @generation, '
    for(var attr in rules.attributes){
        SAVE += `@${attr}, `
    }
    for(var skill in rules.skills){
        SAVE += `@${skill}, `
    }
    for(var discipline in rules.disciplines){
        SAVE += `@${discipline}, `
    }
    SAVE += ' @hunger, @health, @h_superficial, @h_aggravated, @willpower, @w_superficial, @w_aggravated, @humanity, @stains)'

    const save_character_prep = db.prepare(SAVE);
    const save_character = db.transaction((character) => {
        save_character_prep.run(character);
    });
    const load_character = db.prepare(`SELECT * FROM character WHERE name=?`);
    const find_character = db.prepare(`SELECT * FROM character WHERE player=?`);

    function find(player){
        player = String(player);
        return find_character.get(player);
    }

    function load(name){
        return load_character.get(this.sheet.name);
    }

    return{
        save: save_character,
        load: load,
        find: find
    }
}
