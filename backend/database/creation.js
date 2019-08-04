module.exports = function(db){

    var CREATE = `
CREATE TABLE IF NOT EXISTS creation(
player TEXT UNIQUE NOT NULL,
step INTEGER DEFAULT -1)
`

    const create_character_table = db.prepare(CREATE);
    create_character_table.run()

    const do_get = db.prepare('SELECT step FROM creation WHERE player=?');
    const do_set = db.prepare('REPLACE INTO creation(player, step) VALUES(?,?)');

    function get_step(user){
        var who = String(user)
        var rows = do_get.get(who)
        if(rows === undefined)
            return rows
        return rows['step'];
    }
    
    function set_step(user, value){
        var who = String(user)
        var step = Number(value)
        do_set.run(who, step)
    }

    return {
        get_step: get_step,
        set_step: set_step
    }
}
