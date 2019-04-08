module.exports = function(db){

    const ATTRIBUTES = {
        'strength':['str'],
        'dexterity':['dex'],
        'stamina':['sta'],
        'charisma':['cha'],
        'manipulation':['man'],
        'composure':['com'],
        'intelligence':['int'],
        'wits':[],
        'resolve':['res']        
    }



    const SKILLS = [
        'athletics',
        'brawl',
        'craft',
        'drive',
        'firearms',
        'melee',
        'larceny',
        'stealth',
        'survival',
        'animal_ken',
        'etiquette',
        'insight',
        'intimidation',
        'leadership',
        'performance',
        'persuasion',
        'streetwise',
        'subterfuge',
        'academics',
        'awareness',
        'finance',
        'investigation',
        'medicine',
        'occult',
        'politics',
        'science',
        'technology',
    ]

    var CREATE = `
CREATE TABLE IF NOT EXISTS character(
-- General
name TEXT UNIQUE NOT NULL,
player TEXT UNIQUE,
predator TEXT,
sire TEXT,
clan TEXT,
generation INTEGER,

`

    CREATE += '-- Attributes\n'
    for(var attr in ATTRIBUTES){
        CREATE += `${attr} INTEGER DEFAULT 0 CHECK( ${attr} >= 0 AND ${attr} <= 5),\n`
    }
    CREATE += '\n-- Skills\n'
    for(var i = 0; i < SKILLS.length; i++){
        var skill = SKILLS[i];
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


    var SAVE = 'REPLACE INTO character(name, player, predator, sire, clan, generation, '
    for(var attr in ATTRIBUTES){
        SAVE += `${attr}, `
    }
    for(var i = 0; i < SKILLS.length; i++){
        var skill = SKILLS[i];
        SAVE += `${skill}, `
    }
    SAVE += ' hunger, health, h_superficial, h_aggravated, willpower, w_superficial, w_aggravated, humanity, stains) VALUES(@name, @player, @predator, @sire, @clan, @generation, '
    for(var attr in ATTRIBUTES){
        SAVE += `@${attr}, `
    }
    for(var i = 0; i < SKILLS.length; i++){
        var skill = SKILLS[i];
        SAVE += `@${skill}, `
    }
    SAVE += ' @hunger, @health, @h_superficial, @h_aggravated, @willpower, @w_superficial, @w_aggravated, @humanity, @stains)'

    const save_character_prep = db.prepare(SAVE);
    const save_character = db.transaction((character) => {
        save_character_prep.run(character);
    });
    const load_character = db.prepare(`SELECT * FROM character WHERE name=?`);
    const find_character = db.prepare(`SELECT * FROM character WHERE player=?`);

    class Character {

        static find(player){
            player = String(player);
            var row = find_character.get(player);
            if(row == undefined)
                return undefined;
            else{
                var out = new Character(row['name']);
                out.sheet = row;
                return out;
            }
        }
        
        constructor(name, player=null) {
            if(player != null)
                player = String(player)
            this.sheet = {
                name: name,
                player: player,
                predator: '',
                sire: '',
                clan: '',
                generation: 13, //


                hunger: 1,
                health: 0, //
                h_superficial: 0,
                h_aggravated: 0,
                willpower: 1, //
                w_superficial: 0,
                w_aggravated: 0,
                humanity: 7, //
                stains: 0,
            }

            for(var attr in ATTRIBUTES){
                this.sheet[attr] = 1;
            }
            for(var i = 0; i < SKILLS.length; i++){
                var skill = SKILLS[i];
                this.sheet[skill] = 0;
            }
            
        }

        save(){
            save_character(this.sheet);
            return true;
        }
        load(){
            var row = load_character.get(this.sheet.name);
            if(row == undefined)
                return false;
            this.sheet = row;
            return true;
        }


        unalias_attr(what){
            if(! (what in this.sheet) ){
                for(var attr in ATTRIBUTES){
                    if(ATTRIBUTES[attr].indexOf(what) > -1)
                        return attr
                }
                // TODO same for skills
                return undefined
            }
            return what
        }

        get(what){
            what = this.unalias_attr(what)
            if(what === undefined)
                return undefined
            return this.sheet[what]
        }
        
        set(what, value){
            what = this.unalias_attr(what)
            if(what === undefined)
                return "Unknown attribute/skill " + what;

            if(value === NaN)
                return value+" is not a number";

            this.sheet[what] = value;
            this.save()
            return `${this.sheet.name} now has ${value} ${what}`
        }
        
        get_attributes() {
            var physical_n = Object.keys(ATTRIBUTES).length / 3;
            var social_n = physical_n * 2;
            var out = {
                physical: {},
                social: {},
                mental: {}
            }

            var i = 0;
            for(var attr in ATTRIBUTES){
                if(i < physical_n)
                    out.physical[attr] = this.sheet[attr]
                else if(i < social_n)
                    out.social[attr] = this.sheet[attr]
                else
                    out.mental[attr] = this.sheet[attr]
                i++;
            }
            return out;
        }
        
        get_skills() {
            var physical_n = SKILLS.length / 3;
            var social_n = physical_n * 2;
            var out = {
                physical: {},
                social: {},
                mental: {}
            }
            for(var i = 0; i < SKILLS.length; i++){
                var skill = SKILLS[i]
                if(i < physical_n)
                    out.physical[skill] = this.sheet[skill]
                else if(i < social_n)
                    out.social[skill] = this.sheet[skill]
                else
                    out.mental[skill] = this.sheet[skill]
            }
            return out;
        }
    }

    return Character
}
