jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../character')
const specialties_cmd = require('../specialties')
var helper = require('../character_base.js');
var rules = require('../../rules');

function check_cmd(author, command, expected_answer, as_gm){
    fake.check_cmd(specialties_cmd, author, command, expected_answer, as_gm)
}


test('specialties', () => {
    var author = new fake.Author('specialties_cmd_test')

    check_cmd(author, '!character',
              "Could not find a character for " + author.name)

    var character = new Character(author.name + ' character', author.name)
    character.sheet.melee = 2
    character.save()

    expected_reply =  {
        embed: {
            title: "Specialties",
            description: author.name,
            fields: [],
        },
    }

    
    check_cmd(author, '!specialties',
              expected_reply
             )

    character = Character.find(author.name)
    expect(character.specialties).toEqual({})

    check_cmd(author, `!specialties ${author.name} a wrong:wrong`,
              `You can't do that`)

    check_cmd(author, `!specialties ${author.name} a`,
              "add what?",
              true)

    check_cmd(author, `!specialties ${author.name} r`,
              "remove what?",
              true)

    check_cmd(author, `!specialties ${author.name} a wrong wrong`,
              "Give me <skill>:<specialty>",
             true)

    check_cmd(author, `!specialties ${author.name} a brawl:whatever`,
              `Character ${character.sheet.name} doesn't have the skill brawl, so you can't pick a specialty for it`,
                  true)
    
    var skill = "melee"
    var specialty = "Knifes"
    var expected_specialty = specialty.toLowerCase()
    check_cmd(author, `!specialties ${author.name} a ${skill}:${specialty}`,
                  `${character.sheet.name} now has a specialty "${expected_specialty}" for ${skill}`,
                  true)

    character = Character.find(author.name)
    expect(character.specialties[skill]).toEqual([expected_specialty])

    expected_reply.embed.fields.push({
        name: skill,
        value: expected_specialty
    })
    check_cmd(author, '!specialties',
              expected_reply
             )

    check_cmd(author, `!specialties ${author.name} r wrong`,
                  `${character.sheet.name} does not have the "wrong" specialty for any skill`,
              true)
    
    check_cmd(author, `!specialties ${author.name} r ${specialty}`,
                  `${character.sheet.name} no longer has the "${expected_specialty}" specialty for ${skill}`,
                  true)

    character = Character.find(author.name)
    expect(skill in character.specialties).toBe(false)
    
})
