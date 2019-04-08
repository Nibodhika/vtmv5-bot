module.exports = function(db){
    // Create the table if it doesn't exist
    const create = db.prepare('CREATE TABLE IF NOT EXISTS health (USER text UNIQUE NOT NULL, HEALTH INTEGER, SUPERFICIAL INTEGER DEFAULT 0, AGGRAVATED INTEGER DEFAULT 0)');
    create.run()

    // Prepare the queries
    const do_get = db.prepare('SELECT HEALTH, SUPERFICIAL, AGGRAVATED from health where USER=?');
    const ensure_created = db.prepare('INSERT or IGNORE into health (USER) VALUES (?)');
    const do_set = db.prepare('UPDATE health SET HEALTH = ? WHERE USER = ?');
    const do_set_superficial = db.prepare('UPDATE health SET SUPERFICIAL = ? WHERE USER = ?');
    const do_set_aggravated = db.prepare('UPDATE health SET AGGRAVATED = ? WHERE USER = ?');

    class Health{
        constructor(row){
            this.health = rows['HEALTH'];
            this.supperficial = rows['SUPERFICIAL'];
            this.aggravated = rows['AGGRAVATED'];
        }
    }
    
    // Helper to get
    function get(user){
        var who = String(user)
        var rows = do_get.get(who)
        if(rows === undefined)
            return rows
        console.log("rows is: ", rows)
        return Health(rows);
    }

    // Helper to set total
    function set_total(user, value){
        var who = String(user);
        var amount = Number(value);
        ensure_created.run(who);
        var ret = do_set_total.run(amount, who);
        return amount;
    }

    // Helper to set current
    function set_current(user, value){
        var who = String(user);
        var amount = Number(value);
        ensure_created.run(who);
        var ret = do_set_current.run(amount, who);
        return amount;
    }

    // Get, Increase and set
    function heal(user, value){
        var current = get(user)
        var new_value = current + Number(value)
        return set(user, new_value)
    }

    // Get, Decrease and set
    function damage(user, value){
        var current = get(user)
        var new_value = current - Number(value)
        return set(user, new_value)
    }

    return {
        get: get,
        set_total: set_total,
        set_current: set_current,
        heal: heal,
        damage: damage
    }
}
