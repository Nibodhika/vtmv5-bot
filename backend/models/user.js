var database = require('../database')

var Character = require('./character')

class User {

    static create_from_row(row){
        if(row == undefined)
            return undefined;
        
        var user = new User(
            row['username'],
            row['discord_handle'],
            row['is_gm'],
            row['id']
        )
        user.load()
        return user
    }
    
    static all(){
        var rows = database.user.all()
        var out = []
        for(var i in rows){
            var result = rows[i]
            out.push(this.create_from_row(result))
        }
        return out
    }
    
    static find(handle){
        var row = database.user.find_by_handle(player)
        return this.create_from_row(row)
    }

    static get(id){
        var row = database.user.get(id)
        return this.create_from_row(row)
    }

    static authenticate(username,password){
        var row = database.user.authenticate(username,password)
        return this.create_from_row(row)
    }
    
    constructor(name, handle, is_gm=false, id=undefined) {
        this.name = name
        this.handle = handle
        this.is_gm = is_gm
        this.id = id
    }

    load(){
        var character_row = database.character.find_by_player(this.handle);
        // Attempting to load character
        if(character_row != undefined){
            this.character = Character.find(this.handle)
        }
    }
}

module.exports = User
