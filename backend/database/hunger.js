module.exports = function(db){

    // Prepare the queries
    const do_get = db.prepare('SELECT hunger FROM character WHERE player=?');
    const do_set = db.prepare('UPDATE character SET hunger=? WHERE player=?');

    // Helper to get
    function get(user){
        var who = String(user)
        var rows = do_get.get(who)
        if(rows === undefined)
            return rows
        return rows['hunger'];
    }

    // Helper to set
    function set(user, value){
        var who = String(user)
        var amount = Number(value)
        var ret = do_set.run(amount, who)
        return amount
    }

    // Get, Increase and set
    function increase(user, value=1){
        var current = get(user)
        var new_value = current + Number(value)
        return set(user, new_value)
    }

    // Get, Decrease and set
    function decrease(user, value=1){
        var current = get(user)
        var new_value = current - Number(value)
        return set(user, new_value)
    }

    return {
        get: get,
        increase: increase,
        decrease: decrease,
        set: set
    }
}
