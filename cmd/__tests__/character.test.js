jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../models/character')
const character_cmd = require('../character')
var helper = require('../character_base.js');
var rules = require('../../rules');

function check_cmd(author, command, expected_answer, as_gm){
    fake.check_cmd(character_cmd, author, command, expected_answer, as_gm)
}

test('character', () => {
    var author = new fake.Author('character_cmd_test')

    check_cmd(author, '!character',
              "Could not find a character for " + author.name)

    check_cmd(author, `!character ${author.name} c`,
              "You can't do that")

    check_cmd(author, `!character ${author.name} c`,
              "Forgot to give the character a name",
             true)

    check_cmd(author, `!character ${author.name} c character cmd charcter`,
              "Created character character cmd charcter",
             true)

    var character = Character.find(author.name)
    check_cmd(author, '!character',
            helper.print_sheet(character))

    check_cmd(author, `!character ${author.name} s`,
              "Set what to which value?",
              true)

    check_cmd(author, `!character ${author.name} s str`,
              "Set what to which value?",
              true)

    function check_set_sheet(attr_name, value, expected_before, attr_alias=null){
        character = Character.find(author.name)
        expect(character[attr_name]).toBe(expected_before)
        if(attr_alias === null)
            attr_alias = attr_name

        check_cmd(author, `!character ${author.name} s ${attr_alias} ${value}`,
                  `character cmd charcter now has ${value} ${attr_name}`,
                  true)

        character = Character.find(author.name)
        expect(character[attr_name]).toBe(value)
    }

    // set attr by name
    check_set_sheet('dexterity', 3, 1)
    // set attr by alias
    check_set_sheet('strength', 4, 1, 'str')
    
    // set skill by name
    check_set_sheet('athletics', 3, 0)
    // set skill by alias
    check_set_sheet('brawl', 2, 0, 'bra')

    // check set random attributes that uses number
    check_set_sheet('generation', 14, 13)
    // check set random attributes that uses strings
    check_set_sheet('clan', 'brujah', '')

    // check set string with spaces
    check_set_sheet('ambition', 'this is an example with spaces', '')


    // Check add without parameter
    check_cmd(author, `!character ${author.name} a`,
              "add what?",
              true)
    // Check add invalid advantage
    check_cmd(author, `!character ${author.name} a wrong`,
              "wrong is neither an advantage nor a thin blood advantage",
              true)
    // Check add specialty with invalid points
    check_cmd(author, `!character ${author.name} a iliterate 1`,
                  `1 is not a valid number of points for iliterate`,
                  true)
    
    function check_add_advantage(advantage, points='', specification=''){
        character = Character.find(author.name)
        var expected_points = points
        if(points == ''){
            expected_points = rules.advantages[advantage].points[0]
        }
        expected_reply = `added ${advantage} with ${expected_points}`
        if(specification != '')
            expected_reply += ': ' + specification
        
        expect(advantage in character.advantages).toBe(false)

        check_cmd(author, `!character ${author.name} a ${advantage} ${points} ${specification}`,
                  expected_reply,
                  true)

        character = Character.find(author.name)
        expect(advantage in character.advantages).toBe(true)
        expect(character.advantages[advantage]).toEqual({
            points: expected_points,
            specification: specification
        })
    }

    rules.advantages.iliterate.points = [2]
    check_add_advantage('iliterate')
    rules.advantages.allies.points = [3]
    check_add_advantage('allies', 3)
    rules.advantages.contacts.points = [2]
    check_add_advantage('contacts', 2, 'police officer')


    // Check add thin_blood adv to non thin_blood character
    check_cmd(author, `!character ${author.name} a baby_teeth`,
                  `${character.name} is not thin blood, and can't have thin blood advantages`,
              true)

    // Change the clan using the command
    check_set_sheet('clan', 'thin_blood', 'brujah')

    function check_add_thin_blood_adv(advantage, specification=''){
        character = Character.find(author.name)

        expected_reply = `added ${advantage}`
        if(specification != '')
            expected_reply += ': ' + specification
        
        expect(advantage in character.thin_blood_adv).toBe(false)

        check_cmd(author, `!character ${author.name} a ${advantage} ${specification}`,
                  expected_reply,
                  true)

        character = Character.find(author.name)
        expect(advantage in character.thin_blood_adv).toBe(true)
        expect(character.thin_blood_adv[advantage]).toEqual(specification)
    }

    check_add_thin_blood_adv('baby_teeth')
    check_add_thin_blood_adv('camarilla_contact', 'the prince')


    // Check remove without parameter
    check_cmd(author, `!character ${author.name} r`,
              "remove what?",
              true)
    // Check remove with wrong parameter
    check_cmd(author, `!character ${author.name} r wrong`,
              `wrong is neither an advantage nor a thin blood advantage`,
              true)
    
    function check_remove_adv(advantage, list, expect_fail=false){
        character = Character.find(author.name)
        var expected_reply = `${character.name} no longer has ${advantage}`
        if(expect_fail)
            expected_reply = `${character.name} doesn't have the advantage ${advantage}`

        // If the advantage is in the character we shouldn't fail
        expect(advantage in character[list]).toBe(! expect_fail)

        check_cmd(author, `!character ${author.name} r ${advantage}`,
                  expected_reply,
                  true)

        character = Character.find(author.name)
        expect(advantage in character[list]).toBe(false)
    }
    // advantage we do have
    check_remove_adv('allies', 'advantages')
    // Thin blood adv we do have
    check_remove_adv('baby_teeth', 'thin_blood_adv')

    // advantage we don't have
    check_remove_adv('fame', 'advantages', true)
    // Thin blood adv we don't have
    check_remove_adv('clan_curse', 'thin_blood_adv', true)
})
