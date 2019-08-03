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
    
    var INSERT = 'INSERT INTO user(username,password, discord_handle) VALUES(?,?,?)';
    const insert = db.prepare(INSERT);
    
    function create(username, password, discord_handle){
        var out = insert.run(username, password, discord_handle);
        return out['lastInsertRowid'];
    }

    const auth = db.prepare(`SELECT * FROM user WHERE username=? AND password=?`);
    function authenticate(username, password){
        var out = auth.get(username, password);
        delete out.password // Don't send the password
        return out
    }

    const find_query = db.prepare(`SELECT * FROM user WHERE username=?`);
    function find(name){
        name = String(name);
        return find_query.get(name);
    }

    const find_by_handle_query = db.prepare(`SELECT * FROM user WHERE discord_handle=?`);
    function find_by_handle(handle){
        handle = String(handle);
        return find_by_handle_query.get(handle);
    }


    return{
        create: create,
        authenticate: authenticate,
        find: find,
        find_by_handle: find_by_handle
    }
    
}
