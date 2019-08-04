var database = require('../database')
var rules = require('../rules')

function build_character_from_row(row, load_sheet=true){
    if(row == undefined)
        return undefined;

    var out = new Character(row['name']);
    for(var key in row){
        out[key] = row[key]
    }
    out.load(load_sheet)
    return out;
}

class Character {

    static find(player){
        var row = database.character.find_by_player(player)
        return build_character_from_row(row)
    }

    static get(id){
        var row = database.character.get(id)
        return build_character_from_row(row)
    }

    static all(){
        var rows = database.character.all()
        if(rows == undefined)
            return undefined;

        var out = []
        for(var i in rows){
            var result = rows[i]
            var character = build_character_from_row(result, false)
            out.push(character)
        }
        return out

    }
    
    constructor(name, player=null) {
        if(player != null)
            player = String(player)


        this.id = null;
        this.name = name;
        this.player = player;
        this.concept = '';
        this.predator = '';
        this.sire = '';
        this.clan = '';
        this.generation = 13;


        this.hunger = 1;
        this.health = 4;
        this.h_superficial = 0;
        this.h_aggravated = 0;
        this.willpower = 2;
        this.w_superficial = 0;
        this.w_aggravated = 0;
        this.humanity = 7;
        this.stains = 0;
        this.blood_potency =0;
        this.resonance ='';
        this.desire ='';
        this.ambition ='';
        this.xp =0;


        for(var attr in rules.attributes){
            this[attr] = 1;
        }
        for(var skill in rules.skills){
            this[skill] = 0;
        }
        for(var discipline in rules.disciplines){
            this[discipline] = 0;
        }

        this.specialties = {}
        this.powers = []
        this.advantages = {}
        this.thin_blood_adv = {}
        this.convictions = {}
    }

    save(){
        // Database requires a dict and not an object
        var sheet = {}
        for(var key in this){
            sheet[key] = this[key]
        }
        this.id = database.character.save(sheet);
        
        database.specialties.save(this.id, this.specialties)
        database.powers.save(this.id, this.powers)
        database.advantages.save(this.id, this.advantages)
        database.thin_blood_adv.save(this.id, this.thin_blood_adv)
        database.convictions.save(this.id, this.convictions)
        return true;
    }
    load(load_sheet=true){
        if(load_sheet){
            var row = database.character.find(this.name);
            if(row == undefined)
                return false;
            for(var key in row){
                this[key] = row[key]
            }
        }
        

        // Load specialties
        this.specialties = database.specialties.get(this.id)
        //Load powers
        this.powers = database.powers.get(this.id)
        //Load advantages
        this.advantages = database.advantages.get(this.id)
        this.thin_blood_adv = database.thin_blood_adv.get(this.id)

        this.convictions = database.convictions.get(this.id)
        return true;
    }

    static _do_unalias(dict,alias){
        if(alias in dict)
            return alias
        for(var elem in dict){
            if(dict[elem].alias.indexOf(alias) > -1)
                return elem
        }
        return undefined
    }

    static unalias_attr(alias) {
        return Character._do_unalias(rules.attributes,alias);
    }
    static unalias_skill(alias){
        return Character._do_unalias(rules.skills,alias);
    }

    get(what){
        if(['willpower', 'will'].indexOf(what) > -1){
            return this.current_willpower()
        }

        if(what in this){
            return this[what]
        }
        
        var meant = Character.unalias_attr(what)
        if(meant === undefined){
            meant = Character.unalias_skill(what)
        }

        if(meant === undefined)
            return undefined
        return this[meant]
    }
    
    set(what, value,save=true){
        var meant = undefined
        if(what in this)
            meant = what
        else{
            meant = Character.unalias_attr(what)
            if(meant === undefined){
                meant = Character.unalias_skill(what)
                if(meant === undefined)
                    return "Unknown attribute/skill " + what;
            }    
        }

        if(typeof this[meant] === 'number'){
            value = Number(value)
            if(value === NaN)
                return value+" is not a number";
        }
        this[meant] = value;

        //Stamina influences health
        if(meant == 'stamina'){
            this.health = value + 3;
        }
        // willpower = composure + resolve
        else if(['composure', 'resolve'].indexOf(meant) > -1){
            this.willpower = this.composure + this.resolve;
        }

        if(save)
            this.save()
        return `${this.name} now has ${this[meant]} ${meant}`
    }

    _get_attr_skill_list(dict){
        var out = {
            physical: {},
            social: {},
            mental: {}
        }

        for(var elem in dict){
            var element = dict[elem]
            if(element.type == 'physical')
                out.physical[elem] = this[elem]
            else if(element.type == 'social')
                out.social[elem] = this[elem]
            else
                out.mental[elem] = this[elem]
        }
        return out;
    }
    
    get_attributes() {
        return this._get_attr_skill_list(rules.attributes)
    }
    
    get_skills() {
        return this._get_attr_skill_list(rules.skills)
    }

    add_specialty(skill, specialty){
        var meant = Character.unalias_skill(skill)
        if(meant === undefined){
            return `Unknown skill ` + skill
        }

        if(this[meant] > 0){
            if(this.id == null)
                this.save()
            database.specialties.set(this.id,specialty, meant)
            if(!(meant in this.specialties)){
                this.specialties[meant] = []
            }
            this.specialties[meant].push(specialty)
            return `${this.name} now has a specialty "${specialty}" for ${meant}`
        }
        
        return `Character ${this.name} doesn't have the skill ${meant}, so you can't pick a specialty for it`
    }
    remove_specialty(specialty){
        var skill = undefined
        var index = undefined
        for(var s in this.specialties){
            var i = this.specialties[s].indexOf(specialty)
            if(i != -1){
                skill = s
                index = i
                break
            }
        }

        if(skill === undefined){
            return `${this.name} does not have the "${specialty}" specialty for any skill`
        }

        this.specialties[skill].splice(index, 1)
        database.specialties.delete_one(this.id,specialty)
        
        return `${this.name} no longer has the "${specialty}" specialty for ${skill}`

    }

    add_advantage(advantage, points=null, specification = null){
        if(advantage in rules.advantages){
            // Default is the smallest point value
            if(points == null)
                points = rules.advantages[advantage].points[0]
            else if(rules.advantages[advantage].points.indexOf(points) == -1)
                return `${points} is not a valid number of points for ${advantage}`

            // Character already had the advantage, should delete from database
            if(advantage in this.advantages){
                database.advantages.delete_one(this.id,advantage)
            }
            this.advantages[advantage] = {
                points: points,
                specification: specification
            }
            database.advantages.set(this.id, advantage, points, specification)
            return `${this.name} now has advantage ${advantage} with ${points} points`
        }
        return `${advantage} is not a real advantage.`
    }
    remove_advantage(advantage){
        if( ! (advantage in this.advantages)){
            return `${this.name} doesn't have the advantage ${advantage}`
        }
        database.advantages.delete_one(this.id,advantage)
        delete this.advantages[advantage]
        return `${this.name} no longer has ${advantage}`
    }

    add_thin_blood_adv(advantage, specification = ""){
        if(advantage in rules.thin_blood_adv){
            // Character already had the advantage, delete from database
            if(advantage in this.advantages){
                database.thin_blood_adv.delete_one(this.id,advantage)
            }
            this.thin_blood_adv[advantage] = specification
            database.thin_blood_adv.set(this.id, advantage, specification)
            return `${this.name} now has advantage ${advantage}`
        }
        return `${advantage} is not a real thin blood advantage.`
    }
    remove_thin_blood_adv(advantage){
        if( ! (advantage in this.thin_blood_adv)){
            return `${this.name} doesn't have the advantage ${advantage}`
        }
        database.thin_blood_adv.delete_one(this.id,advantage)
        delete this.thin_blood_adv[advantage]
        return `${this.name} no longer has ${advantage}`
    }

    add_conviction(conviction, touchstone){

        if(conviction in this.convictions){
            // Probably changing touchstone
            database.convictions.delete_one(this.id,conviction)
        }
        
        this.convictions[conviction] = touchstone
        database.convictions.set(this.id, conviction,touchstone)
        return `${this.name} now has a conviction ${conviction}`
    }
    remove_conviction(conviction){
        if( ! (conviction in this.convictions)){
            return `${this.name} doesn't have the conviction ${conviction}`
        }
        database.convictions.delete_one(this.id,conviction)
        return `${this.name} no longer has the conviction ${conviction}`
    }


    get_health() {
        var current_health = this.health - this.h_aggravated - this.h_superficial;
        return `${current_health}/${this.health} ${this.h_aggravated}|${this.h_superficial}`
    }

    delete_from_database(){
        database.powers.delete(this.id)
        database.specialties.delete(this.id)
        database.character.delete(this.id)
    }

    current_willpower(){
        return this.willpower - this.w_aggravated - this.w_superficial
    }
}

module.exports = Character
