jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../character')
const health_cmd = require('../health')

function check_cmd(author, command, expected_answer, as_gm){
    fake.check_cmd(health_cmd, author, command, expected_answer, as_gm)
}

test('health', () => {
    var author = new fake.Author('health_cmd_test')

    check_cmd(author, '!health',
             "No health information for " + author.name)

    var character = new Character('check_health_character',author.name)
    character.sheet.health = 7
    character.sheet.h_superficial = 2
    character.sheet.h_aggravated = 1
    character.save()

    check_cmd(author, '!health',
             `health_cmd_test is at 4/7
[X][/][/][ ][ ][ ][ ]`)


    check_cmd(author, '!health',
              `health_cmd_test is at 4/7
[X][/][/][ ][ ][ ][ ]`)

    check_cmd(author, '!health health_cmd_test',
              `health_cmd_test is at 4/7
[X][/][/][ ][ ][ ][ ]`)

    check_cmd(author, '!health health_cmd_test wrong',
              `You can't do that`)
    
    check_cmd(author, '!health health_cmd_test wrong',
              `Unknown option wrong`,
             true)

    check_cmd(author, '!health health_cmd_test d',
              `health_cmd_test is at 3/7
[X][/][/][/][ ][ ][ ]`,
             true)

    check_cmd(author, '!health health_cmd_test d not',
              `not is not a number`,
             true)
    
    check_cmd(author, '!health health_cmd_test d 2',
              `health_cmd_test is at 1/7
[X][/][/][/][/][/][ ]`,
             true)

    check_cmd(author, '!health health_cmd_test d 1 wrong',
              `Unknown type wrong, choose either superficial or aggravated`,
              true)
    
    check_cmd(author, '!health health_cmd_test d 1 aggravated',
              `health_cmd_test is at 0/7
[X][X][/][/][/][/][/]`,
              true)

    check_cmd(author, '!health health_cmd_test h 3 aggravated',
              `health_cmd_test is at 2/7
[/][/][/][/][/][ ][ ]`,
              true)

    check_cmd(author, '!health health_cmd_test h 2',
              `health_cmd_test is at 4/7
[/][/][/][ ][ ][ ][ ]`,
              true)

    check_cmd(author, '!health health_cmd_test s 2 superficial',
              `health_cmd_test is at 5/7
[/][/][ ][ ][ ][ ][ ]`,
              true)

    check_cmd(author, '!health health_cmd_test s 1 aggravated',
              `health_cmd_test is at 4/7
[X][/][/][ ][ ][ ][ ]`,
             true)

    
})
