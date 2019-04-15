var database = require('./database/database.js')
var rules = require('./rules/rules.js')

class Character {

    static find(player){
        var row = database.character.find(player)

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
        
    }

    save(){
        database.character.save(this.sheet);
        return true;
    }
    load(){
        var row = database.character.load(this.sheet.name);
        if(row == undefined)
            return false;
        this.sheet = row;
        return true;
    }


    unalias_attr(what, accept_attributes=true,accept_skills=true){
        if(! (what in this.sheet) ){
            if(accept_attributes){
                console.log("Checcking attributes for " + what)
                for(var attr in rules.attributes){
                    if(rules.attributes[attr].alias.indexOf(what) > -1)
                        return attr
                }                    
            }
            if(accept_skills){
                console.log("Checcking skills for " + what)
                for(var skill in rules.skills) {
                    if(rules.skills[skill].alias.indexOf(what) > -1)
                        return skill
                }                    
            }
            return undefined
        }
        return what
    }

    get(what, accept_attributes=true, accept_skills=true){
        what = this.unalias_attr(what,accept_attributes,accept_skills)
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

        //Stamina influences health
        if(what == 'stamina'){
            this.sheet.health = value + 3;
        }
        // willpower = composure + resolve
        else if(['composure', 'resolve'].indexOf(what) > -1){
            this.sheet.willpower = this.sheet.composure + this.sheet.resolve;
        }
        
        
        this.save()
        return `${this.sheet.name} now has ${value} ${what}`
    }
    
    get_attributes() {
        var physical_n = Object.keys(rules.attributes).length / 3;
        var social_n = physical_n * 2;
        var out = {
            physical: {},
            social: {},
            mental: {}
        }

        var i = 0;
        for(var attr in rules.attributes){
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
        var physical_n = Object.keys(rules.skills).length / 3;
        var social_n = physical_n * 2;
        var out = {
            physical: {},
            social: {},
            mental: {}
        }
        var i = 0;
        for(var skill in rules.skills) {
            if(i < physical_n)
                out.physical[skill] = this.sheet[skill]
            else if(i < social_n)
                out.social[skill] = this.sheet[skill]
            else
                out.mental[skill] = this.sheet[skill]
            i++;
        }
        return out;
    }

    get_health() {
        var current_health = this.sheet.health - this.sheet.h_aggravated - this.sheet.h_superficial;
        return `${current_health}/${this.sheet.health} ${this.sheet.h_aggravated}|${this.sheet.h_superficial}`
    }
}

module.exports = Character
