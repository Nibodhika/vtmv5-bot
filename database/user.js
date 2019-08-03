module.exports = function(db) {

    var CREATE = `
CREATE TABLE IF NOT EXISTS user(
id INTEGER PRIMARY KEY,
username TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
discord_handle TEXT UNIQUE,
is_gm INTEGER DEFAULT 0 CHECK(is_gm IN (0,1) )
)`

    const create_character_table = db.prepare(CREATE);
    create_character_table.run();
    
    const INSERT = db.prepare('INSERT INTO user(username,password, discord_handle, is_gm) VALUES(@username,@password,@discord_handle,@is_gm)');

    const create = db.transaction((username, password, discord_handle, is_gm=false) => {
        is_gm_value = is_gm ? 1 : 0
        var out = INSERT.run({
            username: username,
            password: password,
            discord_handle: discord_handle,
            is_gm: is_gm_value
        })
        return out['lastInsertRowid'];
    });

    function strip_password(result){
        if(result == undefined)
            return result
        delete result.password; // Don't send the password
        return result
    }

    const auth = db.prepare(`SELECT * FROM user WHERE username=? AND password=?`);
    function authenticate(username, password){
        return strip_password(auth.get(username, password))
    }

    const find_query = db.prepare(`SELECT * FROM user WHERE username=?`);
    function find(name){
        name = String(name);
        return strip_password(find_query.get(name));
    }

    const get_query = db.prepare(`SELECT * FROM user WHERE id=?`);
    function get(id){
        id = String(id);
        return strip_password(get_query.get(id));
    }

    const find_by_handle_query = db.prepare(`SELECT * FROM user WHERE discord_handle=?`);
    function find_by_handle(handle){
        handle = String(handle);
        return strip_password(find_by_handle_query.get(handle));
    }

    const all_query = db.prepare(`SELECT * FROM user`);
    function all(){
        var users = all_query.all()
        var out = []
        for(var u in users){
            out.push(strip_password(users[u]));
        }
        return out
    }


    return{
        create: create,
        authenticate: authenticate,
        get: get,
        find: find,
        all:all,
        find_by_handle: find_by_handle
    }
    
}
