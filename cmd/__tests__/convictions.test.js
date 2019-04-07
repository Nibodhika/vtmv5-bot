jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../character')
const convictions_cmd = require('../convictions')
var helper = require('../character_base.js');
var rules = require('../../rules');

function check_cmd(author, command, expected_answer, as_gm){
    fake.check_cmd(convictions_cmd, author, command, expected_answer, as_gm)
}

test('convictions', () => {
    var author = new fake.Author('convictions_cmd_test')

    check_cmd(author, '!character',
              "Could not find a character for " + author.name)

    var character = new Character(author.name + ' character', author.name)
    character.save()
    
    check_cmd(author, '!convictions',
              'Character has the following convictions and touchstones:'
             )

    character = Character.find(author.name)
    expect(character.convictions).toEqual({})

    check_cmd(author, `!convictions ${author.name} a wrong:wrong`,
              `You can't do that`)
    
    var conviction = "The innocents should be spared"
    var touchstone = "Billy, the vampire son"
    var expected_conviction = conviction.toLowerCase()
    var expected_touchstone = touchstone.toLowerCase()
    check_cmd(author, `!convictions ${author.name} a ${conviction}:${touchstone}`,
                  `${character.sheet.name} now has a conviction ${expected_conviction}`,
                  true)

    character = Character.find(author.name)
    expect(character.convictions[expected_conviction]).toEqual(expected_touchstone)

    check_cmd(author, '!convictions',
              `Character has the following convictions and touchstones:
- ${expected_conviction}: ${expected_touchstone}`
             )

    check_cmd(author, `!convictions ${author.name} r wrong`,
                  `${character.sheet.name} doesn't have the conviction wrong`,
              true)
    
    check_cmd(author, `!convictions ${author.name} r ${conviction}`,
                  `${character.sheet.name} no longer has the conviction ${expected_conviction}`,
                  true)

    character = Character.find(author.name)
    expect(expected_conviction in character.convictions).toBe(false)
    
})
