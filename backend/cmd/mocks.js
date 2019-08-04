const mockRandom = require('jest-mock-random').mockRandom

class fakeMsg {
    constructor(author, content, is_gm=false){
        this.author = author
        this.content = content

        // TODO in the future make a fakeChannel
        this.channel = this.author

        this.member = {
            roles: []
        }
        if(is_gm)
            this.member.roles.push({name:"GM"})
    }

    args(){
        var command = this.content.trim().substring(1).replace(/\s\s+/g, ' ').toLowerCase();
        // Split the spaces
        return command.split(' ');
    }

    reply(value){
        this.author.send(value)
    }

}

class fakeAuthor {
    constructor(name){
        this.name = name
        this.replies = []
    }

    toString(){
        return this.name
    }

    msg(content){
        return new fakeMsg(this,content)
    }

    gm_msg(content){
        return new fakeMsg(this,content,true)
    }

    send(value){
        this.replies.push(value)
    }
    get_replies(){
        var out = this.replies
        this.replies = []
        return out
    }
}

module.exports.Msg = fakeMsg
module.exports.Author = fakeAuthor


function check_cmd(cmd, author, command, expected_answer, as_gm=false){
    var msg = undefined
    if(as_gm)
        msg = author.gm_msg(command)
    else
        msg = author.msg(command)
        
    cmd(msg,msg.args())
    // If not already an array convert into one
    if(!Array.isArray(expected_answer))
        expected_answer = [expected_answer]
    expect(author.get_replies()).toEqual(expected_answer)
}
module.exports.check_cmd = check_cmd

function set_dice_results(dice_results){
    var as_float = []
    for(var i in dice_results){
        var die = dice_results[i]
        as_float.push((die - 1) / 10.0)
    }
    mockRandom(as_float);
}
module.exports.set_dice_results = set_dice_results


module.exports.dice_cmd_check = function(cmd, author, content, dice, expected_result, as_gm=false){
    set_dice_results(dice)
    check_cmd(cmd,author,content,expected_result,as_gm)
}
