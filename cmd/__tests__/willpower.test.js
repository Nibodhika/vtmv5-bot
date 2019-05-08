jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../character')
const willpower_cmd = require('../willpower')

function check_cmd(author, command, expected_answer, as_gm){
    fake.check_cmd(willpower_cmd, author, command, expected_answer, as_gm)
}

test('willpower', () => {
    var author = new fake.Author('willpower_cmd_test')

    check_cmd(author, '!willpower',
             "No willpower information for " + author.name)

    var character = new Character('check_willpower_character',author.name)
    character.sheet.willpower = 7
    character.sheet.w_superficial = 2
    character.sheet.w_aggravated = 1
    character.save()

    check_cmd(author, '!willpower',
             `willpower_cmd_test is at 4/7 Willpower
[X][/][/][ ][ ][ ][ ]`)

    check_cmd(author, '!willpower willpower_cmd_test',
              `willpower_cmd_test is at 4/7 Willpower
[X][/][/][ ][ ][ ][ ]`)

    check_cmd(author, '!willpower willpower_cmd_test wrong',
              `You can't do that`)
    
    check_cmd(author, '!willpower willpower_cmd_test wrong',
              `Unknown option wrong`,
             true)

    check_cmd(author, '!willpower willpower_cmd_test d',
              `willpower_cmd_test is at 3/7 Willpower
[X][/][/][/][ ][ ][ ]`,
             true)

    check_cmd(author, '!willpower willpower_cmd_test d not',
              `not is not a number`,
             true)
    
    check_cmd(author, '!willpower willpower_cmd_test damage 2',
              `willpower_cmd_test is at 1/7 Willpower
[X][/][/][/][/][/][ ]`,
             true)

    check_cmd(author, '!willpower willpower_cmd_test d 1 wrong',
              `Unknown type wrong, choose either superficial or aggravated`,
              true)
    
    check_cmd(author, '!willpower willpower_cmd_test d 1 a',
              `willpower_cmd_test is at 0/7 Willpower
[X][X][/][/][/][/][/]`,
              true)

    check_cmd(author, '!willpower willpower_cmd_test heal 3 aggravated',
              `willpower_cmd_test is at 2/7 Willpower
[/][/][/][/][/][ ][ ]`,
              true)
    character = Character.find(author.name)
    expect(character.sheet.w_aggravated).toBe(0)

    check_cmd(author, '!willpower willpower_cmd_test h 2',
              `willpower_cmd_test is at 4/7 Willpower
[/][/][/][ ][ ][ ][ ]`,
              true)

    check_cmd(author, '!willpower willpower_cmd_test set 2 superficial',
              `willpower_cmd_test is at 5/7 Willpower
[/][/][ ][ ][ ][ ][ ]`,
              true)

    check_cmd(author, '!willpower willpower_cmd_test s 1 aggravated',
              `willpower_cmd_test is at 4/7 Willpower
[X][/][/][ ][ ][ ][ ]`,
              true)

    check_cmd(author, '!willpower willpower_cmd_test h 4 s',
              `willpower_cmd_test is at 6/7 Willpower
[X][ ][ ][ ][ ][ ][ ]`,
              true)
    character = Character.find(author.name)
    expect(character.sheet.w_superficial).toBe(0)
    
})
