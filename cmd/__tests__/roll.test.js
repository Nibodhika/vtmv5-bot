jest.setMock('../../database', require('../../database/db.mock'));

const database = require('../../database')
const Character = require('../../character')
const roll = require('../roll')
const fake = require('../mocks')

function check_cmd(author,content,dice,expected_result,as_gm=false){
    fake.dice_cmd_check(roll.cmd, author,content,dice,expected_result,as_gm)
}

test('basic roll', () =>{
    var author = new fake.Author('basic_roll')
    var msg = author.msg("!roll")


    check_cmd(author,
                           "!roll",
                           [3],
                           [{
                               embed: {
                                   color: 0,
                                   description: "1d10 vs 1 with 0 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 0\nMargin: 1",
                                       },
                                       {
                                           name: "Dice",
                                           value: "3",
                                       },
                                   ],
                                   title: "Failure",
                               },
                           }])

    // Roll passing amount
    check_cmd(author,
                           "!roll wrong",
                           [1],
                           ["Amount 'wrong' is not an integer or a valid roll"])
    // Test a critical success with just the amount
    check_cmd(author,
                           "!roll 6",
                           [3,6,8,10,10,7],
                           [{
                               embed: {
                                   color: 65280,
                                   description: "6d10 vs 1 with 0 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 7\nMargin: 6",
                                       },
                                       {
                                           name: "Dice",
                                           value: "3,6,8,10,10,7",
                                       },
                                   ],
                                   title: "Critical Success!",
                               },
                           }])
    // wrong difficulty
    check_cmd(author,
                           "!roll 6 wrong",
                           [1],
                           ["Difficulty 'wrong' is not an integer"])
    // test a success with amount and difficulty
    check_cmd(author,
                           "!roll 6 3",
                           [3,6,10,8,7,5],
                           [{
                               embed: {
                                   color: 33823,
                                   description: "6d10 vs 3 with 0 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 4\nMargin: 1",
                                       },
                                       {
                                           name: "Dice",
                                           value: "3,6,10,8,7,5",
                                       },
                                   ],
                                   title: "Success",
                               },
                           }])
    
    // normal player can't set hunger
    check_cmd(author,
                           "!roll 6 3 wrong",
                           [1],
                           ["You can't set the hunger on a roll"])
    
    // wrong hunger
    check_cmd(author,
                           "!roll 6 3 wrong",
                           [1],
                           ["Hunger 'wrong' is not an integer"],
                           true)

    // test a messy critical with amount, difficulty and hunger
    check_cmd(author,
                           "!roll 6 3 2",
                           [10,6,10,8,4,5],
                           [{
                               embed: {
                                   color: 16749056,
                                   description: "6d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 6\nMargin: 3",
                                       },
                                       {
                                           name:"Hunger Dice",
                                           value: "10,6"
                                       },
                                       {
                                           name: "Dice",
                                           value: "10,8,4,5",
                                       },
                                   ],
                                   title: "Messy Critical!",
                               },
                           }],
                           true) // as_gm

    // test a bestial failure with amount, difficulty and hunger
    check_cmd(author,
                           "!roll 6 3 2",
                           [1,6,3,8,4,5],
                           [{
                               embed: {
                                   color: 16711680,
                                   description: "6d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 2\nMargin: 1",
                                       },
                                       {
                                           name:"Hunger Dice",
                                           value: "1,6"
                                       },
                                       {
                                           name: "Dice",
                                           value: "3,8,4,5",
                                       },
                                   ],
                                   title: "Bestial Failure!",
                               },
                           }],
                          true) // as_gm
})



test('character roll', () =>{
    var author = new fake.Author('basic_roll')
    var msg = author.msg("!roll")
    var character = new Character('character_basic_roll', author.name)
    character.sheet.hunger = 2
    character.sheet.strength = 3
    character.sheet.melee = 2
    character.sheet.potence = 1
    character.save()
    
    check_cmd(author,
                           "!roll",
                           [3],
                           [{
                               embed: {
                                   color: 0,
                                   description: "1d10 vs 1 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 0\nMargin: 1",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "3",
                                       },
                                   ],
                                   title: "Failure",
                               },
                           }])

    // Roll passing a wrong value
    check_cmd(author,
                           "!roll wrong",
                           [1],
                           ["Amount 'wrong' is not an integer or a valid roll"])

    // Testing roll characteristic
    check_cmd(author,
                           "!roll str+melee+potence 3",
                           [3,10,6,2,7,9],
                           [{
                               embed: {
                                   color: 33823,
                                   description: "6d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 4\nMargin: 1",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "3,10",
                                       },
                                       {
                                           name: "Dice",
                                           value: "6,2,7,9",
                                       },
                                   ],
                                   title: "Success",
                               },
                           }])

    // Testing roll characteristic with + modifiers
    check_cmd(author,
                           "!roll str+melee+potence+2 3",
                           [3,10,6,2,7,9,2,8],
                           [{
                               embed: {
                                   color: 33823,
                                   description: "8d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 5\nMargin: 2",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "3,10",
                                       },
                                       {
                                           name: "Dice",
                                           value: "6,2,7,9,2,8",
                                       },
                                   ],
                                   title: "Success",
                               },
                           }])


    function check_with_negative_modifiers(command) {
        // test with - modifiers
        check_cmd(author,
                               command,
                               [3,10,6,9],
                               [{
                                   embed: {
                                       color: 33823,
                                       description: "4d10 vs 2 with 2 Hunger.",
                                       fields: [
                                           {
                                               name: "Margin",
                                               value: "Successes: 3\nMargin: 1",
                                           },
                                           {
                                               name: "Hunger Dice",
                                               value: "3,10",
                                           },
                                           {
                                               name: "Dice",
                                               value: "6,9",
                                           },
                                       ],
                                       title: "Success",
                                   },
                               }])    
    }
    
    // test with - modifiers. Both the intuitive and the "correct" should work
    check_with_negative_modifiers("!roll str+melee+potence-2 2")
    check_with_negative_modifiers("!roll str+melee+potence+-2 2")
    // Also let's check some empty values
    check_with_negative_modifiers("!roll str++melee+potence+-2 2")
})
