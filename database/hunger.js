module.exports = function(db){
    // Create the table if it doesn't exist
    const create = db.prepare('CREATE TABLE IF NOT EXISTS hunger (USER text UNIQUE NOT NULL, HUNGER INTEGER)');
    create.run()

    // Prepare the queries
    const do_get = db.prepare('SELECT HUNGER from hunger where USER=?');
    const do_set = db.prepare('REPLACE into hunger (USER,HUNGER) VALUES (?,?)');

    // Helper to get
    function get(user){
        var who = String(user)
        var rows = do_get.get(who)
        if(rows === undefined)
            return rows
        return rows['HUNGER'];
    }

    // Helper to set
    function set(user, value){
        var who = String(user)
        var amount = Number(value)
        var ret = do_set.run(who, amount)
        return amount
    }

    // Get, Increase and set
    function increase(user, value){
        var current = get(user)
        var new_value = current + Number(value)
        return set(user, new_value)
    }

    // Get, Decrease and set
    function decrease(user, value){
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
