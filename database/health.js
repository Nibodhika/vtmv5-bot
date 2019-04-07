module.exports = function(db){

    // Prepare the queries
    const do_get = db.prepare('SELECT health, h_superficial, h_aggravated FROM character WHERE player=?');
    const do_set = db.prepare('UPDATE character SET health=? WHERE player=?');
    const do_set_superficial = db.prepare('UPDATE character SET h_superficial=? WHERE player=?');
    const do_set_aggravated = db.prepare('UPDATE character SET h_aggravated=? WHERE player=?');

    // Helper to get
    function get(user){
        var who = String(user)
        var rows = do_get.get(who)
        if(rows === undefined)
            return rows
        return rows;
    }

    function _do_set(user,value,set_function){
        var who = String(user);
        var amount = Number(value);
        if(isNaN(amount)){
            return undefined
        }
        if(amount < 0)
            amount = 0
        var ret = set_function.run(amount, who);
        // Change didn't happened
        if(ret['changes'] == 0)
            return undefined
        return amount;
    }

    function set_total(user,value){
        return _do_set(user,value,do_set)
    }
    
    // Helper to set superficial damage
    function set_superficial(user, value){
        return _do_set(user,value,do_set_superficial)
    }
    // Helper to set aggravated damage
    function set_aggravated(user, value){
        return _do_set(user,value,do_set_aggravated)
    }

    // Get, Decrease and set
    function _do_heal(user,value,attr_name,set_function){
        var current = get(user)
        var amount = Number(value)
        if(isNaN(amount))
            return undefined
        var new_value = current[attr_name] - amount
        if(new_value < 0)
            new_value = 0
        return set_function(user, new_value)
    }
    function heal_superficial(user, value){
        return _do_heal(user,value,
                        'h_superficial',
                        set_superficial)
    }
    function heal_aggravated(user, value){
        return _do_heal(user,value,
                        'h_aggravated',
                        set_aggravated)
    }

    // Get, Increase and set
    function _do_damage(user,value,attr_name,set_function){
        var current = get(user)
        if(current === undefined)
            return undefined
        var amount = Number(value)
        if(isNaN(amount))
            return undefined
        var new_value = current[attr_name] + amount
        return set_function(user, new_value)
    }
    function superficial_damage(user, value){
        return _do_damage(user,value,
                          'h_superficial',
                          set_superficial)
    }
    function aggravated_damage(user, value){
        return _do_damage(user,value,
                          'h_aggravated',
                          set_aggravated)
    }

    return {
        get: get,
        set_total:set_total,
        set_superficial: set_superficial,
        set_aggravated: set_aggravated,
        heal_superficial: heal_superficial,
        heal_aggravated: heal_aggravated,
        superficial_damage: superficial_damage,
        aggravated_damage: aggravated_damage,
    }
}
