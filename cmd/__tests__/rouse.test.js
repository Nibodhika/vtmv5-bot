jest.setMock('../../database', require('../../database/db.mock'));

const mockRandom = require('jest-mock-random').mockRandom

const database = require('../../database')
const Character = require('../../character')
const rouse = require('../rouse')
const fake = require('../mocks')


function check_cmd(author, command, expected_answer, as_gm){
    fake.dice_cmd_check(rouse, author, command, expected_answer, as_gm)
}

test('basic rouse', () =>{
    var author = new fake.Author('basic_rouse')

    check_cmd(author,
                           "!rouse",
                           [3],
                           ["No character information for basic_rouse"])

    // Create the character
    var character = new Character('character_basic_rouse', author.name)
    character.sheet.hunger = 2
    character.save()
    
    check_cmd(author,
                           "!rouse",
                           [3, 2],
                           [{
                               embed: {
                                   color: 0,
                                   title: "Failure",
                                   description: "Your hunger increases to 3",
                                   fields: [
                                       {
                                           name: "Dice",
                                           value: "3",
                                       },
                                   ],
                               },
                           }])

    // Character should have hunger increased
    character = Character.find(author.name);
    expect(character.sheet.hunger).toBe(3)


    // A success should not increase hunger
    check_cmd(author,
                           "!rouse",
                           [6, 2],
                           [{
                               embed: {
                                   color: 33823,
                                   title: "Success",
                                   description: "Your hunger stays the same",
                                   fields: [
                                       {
                                           name: "Dice",
                                           value: "6",
                                       },
                                   ],
                               },
                           }])

    // Character should have the same hunger
    character = Character.find(author.name);
    expect(character.sheet.hunger).toBe(3)

    // Test a rouse check with two dice
    check_cmd(author,
                           "!rouse 2",
                           [3, 2],
                           [{
                               embed: {
                                   color: 0,
                                   title: "Failure",
                                   description: "Your hunger increases to 4",
                                   fields: [
                                       {
                                           name: "Dice",
                                           value: "3,2",
                                       },
                                   ],
                               },
                           }])

    // Character should have hunger increased
    character = Character.find(author.name);
    expect(character.sheet.hunger).toBe(4)

    // If the character is at hunger 5 and fails it should frenzy
    character.sheet.hunger = 5
    character.save()

    check_cmd(author,
                           "!rouse",
                           [3],
                           [{
                               embed: {
                                   color: 16711680,
                                   title: "Failure",
                                   description: "You would enter a hunger frenzy, if your blood weren't so thin",
                                   fields: [
                                       {
                                           name: "Dice",
                                           value: "3",
                                       },
                                   ],
                               },
                           }])

    // Character should have stayed the same
    character = Character.find(author.name);
    expect(character.sheet.hunger).toBe(5)

    
})
