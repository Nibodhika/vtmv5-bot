module.exports = function(db){

    var CREATE = `
CREATE TABLE IF NOT EXISTS rolls(
player TEXT UNIQUE NOT NULL,
hunger INTEGER NOT NULL DEFAULT 1,
dice TEXT NOT NULL,
difficulty INTEGER NOT NULL DEFAULT 1
)
`

    const create_character_table = db.prepare(CREATE);
    create_character_table.run()

    const do_get = db.prepare('SELECT * FROM rolls WHERE player=?');
    const do_set = db.prepare('REPLACE INTO rolls(player, dice, difficulty, hunger) VALUES(?,?,?,?)');

    function get(user){
        var who = String(user)
        var rows = do_get.get(who)
        if(rows === undefined)
            return rows
        var dice = []
        var d2 = rows['dice'].split(',')        
        for(i in d2)
            dice.push(Number(d2[i]))
            
        return {
            dice:dice,
            hunger:rows['hunger'],
            difficulty:rows['difficulty']
        }
    }
    
    function set(user, dice, difficulty, hunger){
        var who = String(user)
        do_set.run(who, String(dice), difficulty, hunger)
    }

    return {
        get: get,
        set: set
    }
}
