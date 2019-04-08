module.exports = function(db){

    // Prepare the queries
    const do_get = db.prepare('SELECT health, h_superficial, h_aggravated FROM character WHERE player=?');
    const do_set = db.prepare('UPDATE character SET health=? WHERE player=?');
    const do_set_superficial = db.prepare('UPDATE character SET h_superficial=? WHERE player=?');
    const do_set_aggravated = db.prepare('UPDATE character SET h_aggravated=? WHERE player=?');

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
