jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../models/character')
const humanity_cmd = require('../humanity')
const rules = require('../../rules')

function check_cmd(author, command, expected_answer, as_gm=false){
    fake.check_cmd(humanity_cmd, author, command, expected_answer, as_gm)
}
function dice_cmd_check(author,content,dice,expected_result,as_gm=false){
    fake.dice_cmd_check(humanity_cmd, author,content,dice,expected_result,as_gm)
}

function get_humanity_characteristics(humanity_level){
    var reply = ""
    var humanity_rules = rules.humanity[humanity_level]
    for(var i in humanity_rules){
        reply += '\n- ' + humanity_rules[i]
    }
    return reply
}

test('humanity', () => {
    var author = new fake.Author('humanity_cmd_test')

    check_cmd(author, '!humanity',
              "No humanity information for " + author.name)

    var character = new Character('check_humanity_character',author.name)
    character.save()

    check_cmd(author, '!humanity',
             `${author.name} is at Humanity 7/3/0
[X][X][X][X][X][X][X][ ][ ][ ]`)

    character.stains = 1
    character.save()
    check_cmd(author, `!humanity ${author.name}`,
              `${author.name} is at Humanity 7/2/1
[X][X][X][X][X][X][X][ ][ ][/]`)

    // Check only GM can give third parameter
    check_cmd(author, `!humanity ${author.name} whatever`,
              "You can't do that"
             )

    // Check wrong third parameter as GM
    check_cmd(author, `!humanity ${author.name} wrong`,
              "Unknown option wrong",
              true
             )

    // Check add one stain
    check_cmd(author, `!humanity ${author.name} stains`,
              `${author.name} is now at Humanity 7/1/2
[X][X][X][X][X][X][X][ ][/][/]`,
              true
             )

    // Wrong number of stains
    check_cmd(author, `!humanity ${author.name} stains wrong`,
              `wrong is not a number`,
              true
             )

    // No willpower damage before
    character = Character.find(author.name)
    expect(character.w_aggravated).toBe(0)
    // Suffers stains enough to trigger degeneration
    check_cmd(author, `!humanity ${author.name} stains 3`,
              `${author.name} has suffer degeneration and taken 2 point(s) of aggravated willpower damage and is now Impaired (page 239)
Humanity 7/0/3
[X][X][X][X][X][X][X][/][/][/]`,
              true
             )
    // Now it has aggravated willpower damage
    character = Character.find(author.name)
    expect(character.w_aggravated).toBe(2)

    
    // Remorse
    dice_cmd_check(author, `!humanity ${author.name} remorse`,
                   [6,2],
                   `${author.name} succeeds his remorse check and stays at Humanity 7\nDice: 6`,
                   true)
    // It should have stayed at humanity 7 and now have no stains
    character = Character.find(author.name)
    expect(character.humanity).toBe(7)
    expect(character.stains).toBe(0)


    // Remorse without stains is not needed
    dice_cmd_check(author, `!humanity ${author.name} remorse`,
                   [6,2],
                   `No remorse check needed for ${author.name}\n He stays at Humanity 7`,
                  true)

    // Failed remorse check
    character.stains = 1
    character.save()
    var expected_reply = `${author.name} failed his remorse check and is now at Humanity 6\nDice: 1,2\nYour new level of humanity has the following characteristics:${get_humanity_characteristics(6)}`
    dice_cmd_check(author, `!humanity ${author.name} remorse`,
                   [1,2],
                   expected_reply,
                   true)
    character = Character.find(author.name)
    expect(character.stains).toBe(0)
    expect(character.humanity).toBe(6)

    character.stains = 4
    character.save()

    expected_reply = `${author.name} rationalizes the monster he's become and is now at Humanity 5 and no longer Impaired\nYour new level of humanity has the following characteristics:${get_humanity_characteristics(5)}`
    check_cmd(author, `!humanity ${author.name} rationalize`,
              expected_reply,
              true)    
    
})
