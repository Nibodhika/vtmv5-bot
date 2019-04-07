jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../character')
const specialities_cmd = require('../specialities')
var helper = require('../character_base.js');
var rules = require('../../rules');

function check_cmd(author, command, expected_answer, as_gm){
    fake.check_cmd(specialities_cmd, author, command, expected_answer, as_gm)
}


test('specialities', () => {
    var author = new fake.Author('specialities_cmd_test')

    check_cmd(author, '!character',
              "Could not find a character for " + author.name)

    var character = new Character(author.name + ' character', author.name)
    character.sheet.melee = 2
    character.save()
    
    check_cmd(author, '!specialities',
              'Character has the following specialities:'
             )

    character = Character.find(author.name)
    expect(character.specialities).toEqual({})

    check_cmd(author, `!specialities ${author.name} a wrong:wrong`,
              `You can't do that`)

    check_cmd(author, `!specialities ${author.name} a brawl:whatever`,
              `Character ${character.sheet.name} doesn't have the skill brawl, so you can't pick a speciality for it`,
                  true)
    
    var skill = "melee"
    var speciality = "Knifes"
    var expected_speciality = speciality.toLowerCase()
    check_cmd(author, `!specialities ${author.name} a ${skill}:${speciality}`,
                  `${character.sheet.name} now has a speciality "${expected_speciality}" for ${skill}`,
                  true)

    character = Character.find(author.name)
    expect(character.specialities[skill]).toEqual([expected_speciality])

    check_cmd(author, '!specialities',
              `Character has the following specialities:
- ${skill}: ${expected_speciality}`
             )

    check_cmd(author, `!specialities ${author.name} r wrong`,
                  `${character.sheet.name} does not have the "wrong" speciality for any skill`,
              true)
    
    check_cmd(author, `!specialities ${author.name} r ${speciality}`,
                  `${character.sheet.name} no longer has the "${expected_speciality}" speciality for ${skill}`,
                  true)

    character = Character.find(author.name)
    expect(skill in character.specialities).toBe(false)
    
})
