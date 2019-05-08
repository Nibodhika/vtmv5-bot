var database = require('./database')
var rules = require('./rules')

class Character {

    static find(player){
        var row = database.character.find(player)

        if(row == undefined)
            return undefined;
        else{
            var out = new Character(row['name']);
            out.sheet = row;
            out.load()
            return out;
        }
    }
    
    constructor(name, player=null) {
        if(player != null)
            player = String(player)

        this.sheet = {
            id: null,
            name: name,
            player: player,
            concept: '',
            predator: '',
            sire: '',
            clan: '',
            generation: 13,


            hunger: 1,
            health: 4,
            h_superficial: 0,
            h_aggravated: 0,
            willpower: 2,
            w_superficial: 0,
            w_aggravated: 0,
            humanity: 7,
            stains: 0,
            blood_potency:0,
            resonance:'',
            desire:'',
            ambition:'',
            xp:0,
        }

        for(var attr in rules.attributes){
            this.sheet[attr] = 1;
        }
        for(var skill in rules.skills){
            this.sheet[skill] = 0;
        }
        for(var discipline in rules.disciplines){
            this.sheet[discipline] = 0;
        }

        this.specialties = {}
        this.powers = []
        this.advantages = {}
        this.thin_blood_adv = {}
        this.convictions = {}
    }

    save(){
        this.sheet.id = database.character.save(this.sheet);
        database.specialties.save(this.sheet.id, this.specialties)
        database.powers.save(this.sheet.id, this.powers)
        database.advantages.save(this.sheet.id, this.advantages)
        database.thin_blood_adv.save(this.sheet.id, this.thin_blood_adv)
        database.convictions.save(this.sheet.id, this.convictions)
        return true;
    }
    load(){
        var row = database.character.get(this.sheet.name);
        if(row == undefined)
            return false;
        this.sheet = row;

        // Load specialties
        this.specialties = database.specialties.get(this.sheet.id)
        //Load powers
        this.powers = database.powers.get(this.sheet.id)
        //Load advantages
        this.advantages = database.advantages.get(this.sheet.id)
        this.thin_blood_adv = database.thin_blood_adv.get(this.sheet.id)

        this.convictions = database.convictions.get(this.sheet.id)
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
        if(what in this.sheet){
            return this.sheet[what]
        }
        
        var meant = Character.unalias_attr(what)
        if(meant === undefined){
            meant = Character.unalias_skill(what)
        }

        if(meant === undefined)
            return undefined
        return this.sheet[meant]
    }
    
    set(what, value,save=true){
        var meant = undefined
        if(what in this.sheet)
            meant = what
        else{
            meant = Character.unalias_attr(what)
            if(meant === undefined){
                meant = Character.unalias_skill(what)
                if(meant === undefined)
                    return "Unknown attribute/skill " + what;
            }    
        }

        if(typeof this.sheet[meant] === 'number'){
            value = Number(value)
            if(value === NaN)
                return value+" is not a number";
        }
        this.sheet[meant] = value;

        //Stamina influences health
        if(meant == 'stamina'){
            this.sheet.health = value + 3;
        }
        // willpower = composure + resolve
        else if(['composure', 'resolve'].indexOf(meant) > -1){
            this.sheet.willpower = this.sheet.composure + this.sheet.resolve;
        }

        if(save)
            this.save()
        return `${this.sheet.name} now has ${this.sheet[meant]} ${meant}`
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
                out.physical[elem] = this.sheet[elem]
            else if(element.type == 'social')
                out.social[elem] = this.sheet[elem]
            else
                out.mental[elem] = this.sheet[elem]
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

        if(this.sheet[meant] > 0){
            if(this.sheet.id == null)
                this.save()
            database.specialties.set(this.sheet.id,specialty, meant)
            if(!(meant in this.specialties)){
                this.specialties[meant] = []
            }
            this.specialties[meant].push(specialty)
            return `${this.sheet.name} now has a specialty "${specialty}" for ${meant}`
        }
        
        return `Character ${this.sheet.name} doesn't have the skill ${meant}, so you can't pick a specialty for it`
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
            return `${this.sheet.name} does not have the "${specialty}" specialty for any skill`
        }

        this.specialties[skill].splice(index, 1)
        database.specialties.delete_one(this.sheet.id,specialty)
        
        return `${this.sheet.name} no longer has the "${specialty}" specialty for ${skill}`

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
                database.advantages.delete_one(this.sheet.id,advantage)
            }
            this.advantages[advantage] = {
                points: points,
                specification: specification
            }
            database.advantages.set(this.sheet.id, advantage, points, specification)
            return `${this.sheet.name} now has advantage ${advantage} with ${points} points`
        }
        return `${advantage} is not a real advantage.`
    }
    remove_advantage(advantage){
        if( ! (advantage in this.advantages)){
            return `${this.sheet.name} doesn't have the advantage ${advantage}`
        }
        database.advantages.delete_one(this.sheet.id,advantage)
        delete this.advantages[advantage]
        return `${this.sheet.name} no longer has ${advantage}`
    }

    add_thin_blood_adv(advantage, specification = ""){
        if(advantage in rules.thin_blood_adv){
            // Character already had the advantage, delete from database
            if(advantage in this.advantages){
                database.thin_blood_adv.delete_one(this.sheet.id,advantage)
            }
            this.thin_blood_adv[advantage] = specification
            database.thin_blood_adv.set(this.sheet.id, advantage, specification)
            return `${this.sheet.name} now has advantage ${advantage}`
        }
        return `${advantage} is not a real thin blood advantage.`
    }
    remove_thin_blood_adv(advantage){
        if( ! (advantage in this.thin_blood_adv)){
            return `${this.sheet.name} doesn't have the advantage ${advantage}`
        }
        database.thin_blood_adv.delete_one(this.sheet.id,advantage)
        delete this.thin_blood_adv[advantage]
        return `${this.sheet.name} no longer has ${advantage}`
    }

    add_conviction(conviction, touchstone){

        if(conviction in this.convictions){
            // Probably changing touchstone
            database.convictions.delete_one(this.sheet.id,conviction)
        }
        
        this.convictions[conviction] = touchstone
        database.convictions.set(this.sheet.id, conviction,touchstone)
        return `${this.sheet.name} now has a conviction ${conviction}`
    }
    remove_conviction(conviction){
        if( ! (conviction in this.convictions)){
            return `${this.sheet.name} doesn't have the conviction ${conviction}`
        }
        database.convictions.delete_one(this.sheet.id,conviction)
        return `${this.sheet.name} no longer has the conviction ${conviction}`
    }


    get_health() {
        var current_health = this.sheet.health - this.sheet.h_aggravated - this.sheet.h_superficial;
        return `${current_health}/${this.sheet.health} ${this.sheet.h_aggravated}|${this.sheet.h_superficial}`
    }

    delete_from_database(){
        database.powers.delete(this.sheet.id)
        database.specialties.delete(this.sheet.id)
        database.character.delete(this.sheet.id)
    }

    current_willpower(){
        return this.sheet.willpower - this.sheet.w_aggravated - this.sheet.w_superficial
    }
}

module.exports = Character
