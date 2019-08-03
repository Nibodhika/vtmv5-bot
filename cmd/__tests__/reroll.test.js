jest.setMock('../../database', require('../../database/db.mock'));
const mockRandom = require('jest-mock-random').mockRandom

const fake = require('../mocks.js')
const Character = require('../../models/character')
const reroll_cmd = require('../reroll')
const database = require('../../database')

function test_reroll_cmd(author,content,prev_roll,dice,expected_result){
    if(prev_roll){
        database.rolls.set(author.name,prev_roll, 3, 2)
    }

    fake.dice_cmd_check(reroll_cmd, author, content, dice, expected_result)
}

test('basic reroll', () =>{
    var author = new fake.Author('basic_reroll')

    test_reroll_cmd(author,
                           "!reroll",
                           null,
                           [],
                           ["You haven't yet rolled anything"])

    // perform a default reroll
    test_reroll_cmd(author,
                           "!reroll",
                           [6,5,2,6,10,1],
                           [9,8],
                           [{
                               embed: {
                                   color: 33823,
                                   title: "Success",
                                   description: "6d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 5\nMargin: 2",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "6,5",
                                       },
                                       {
                                           name: "Dice",
                                           value: "6,10,9,8",
                                       },
                                   ],
                               },
                           }])
    // Check that the new result is being saved in the database
    var new_roll = database.rolls.get(author.name)
    expect(new_roll).toEqual({
        dice: [6,5,6,10,9,8],
        difficulty: 3,
        hunger: 2
    })

    // Reroll tens
    test_reroll_cmd(author,
                           "!reroll tens",
                           [10,5,2,6,10,1], // This was a messy critical
                           [7],
                           [{
                               embed: {
                                   color: 33823,
                                   title: "Success",
                                   description: "6d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 3\nMargin: 0",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "10,5",
                                       },
                                       {
                                           name: "Dice",
                                           value: "2,6,1,7",
                                       },
                                   ],
                               },
                           }])

    // Reroll nontens
    test_reroll_cmd(author,
                           "!reroll nontens",
                           [1,3,10,5], // This was a fail, only way to succeed is to score a critical
                           [10],
                           [{
                               embed: {
                                   color: 65280,
                                   title: "Critical Success!",
                                   description: "4d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 4\nMargin: 1",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "1,3",
                                       },
                                       {
                                           name: "Dice",
                                           value: "10,10",
                                       },
                                   ],
                               },
                           }])

    // Reroll messy
    test_reroll_cmd(author,
                           "!reroll messy",
                           [10,3,10,7,4], // This was a messy crit, just rerolling the 10s might make this fail, so we need to reroll the 4 as well
                           [8,5],
                           [{
                               embed: {
                                   color: 33823,
                                   title: "Success",
                                   description: "5d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 3\nMargin: 0",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "10,3",
                                       },
                                       {
                                           name: "Dice",
                                           value: "7,8,5",
                                       },
                                   ],
                               },
                           }])

    // Reroll by numbers
    test_reroll_cmd(author,
                           "!reroll 1,2,3",
                           [3,2,3,4,9],
                           [8],
                           [{
                               embed: {
                                   color: 0,
                                   title: "Failure",
                                   description: "5d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 2\nMargin: 1",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "3,2",
                                       },
                                       {
                                           name: "Dice",
                                           value: "4,9,8",
                                       },
                                   ],
                               },
                           }])

    // Reroll messy, but using +
    test_reroll_cmd(author,
                           "!reroll fail+10",
                           [10,3,10,7,4], // This was a messy crit, just rerolling the 10s might make this fail, so we need to reroll the 4 as well
                           [8,5],
                           [{
                               embed: {
                                   color: 33823,
                                   title: "Success",
                                   description: "5d10 vs 3 with 2 Hunger.",
                                   fields: [
                                       {
                                           name: "Margin",
                                           value: "Successes: 3\nMargin: 0",
                                       },
                                       {
                                           name: "Hunger Dice",
                                           value: "10,3",
                                       },
                                       {
                                           name: "Dice",
                                           value: "7,8,5",
                                       },
                                   ],
                               },
                           }])
})





test('rerolling damages willpower', () =>{
    var author = new fake.Author('reroll_willpower')
    var msg = author.msg("!reroll")
    
    var character = new Character(author.name + ' character', author.name)
    character.sheet.willpower = 3
    character.save()

    // this reroll should fail because we didn't had anything to reroll
    reroll_cmd(msg,msg.args())
    // So willpower should still be the same
    character = Character.find(author.name)
    expect(character.sheet.w_superficial).toBe(0)
    // ensure there's something to reroll
    database.rolls.set(author.name, [1,2,3,4,5], 3, 2)

    // this reroll should fail because the message is wrong
    var msg_wrong = author.msg("!reroll wrong")
    reroll_cmd(msg_wrong,msg_wrong.args())
    // So willpower should still be the same
    character = Character.find(author.name)
    expect(character.sheet.w_superficial).toBe(0)
    
    // Now do a roll that should work
    reroll_cmd(msg,msg.args())
    // Check that the character lost willpower
    character = Character.find(author.name)
    expect(character.sheet.w_superficial).toBe(1)

    author.get_replies() // discard previous replies
    character.sheet.w_superficial = 3
    character.save()

    test_reroll_cmd(author,
                           "!reroll",
                           [6,5,2,6,10,1],
                           [9,8],
                           ["Your character has no willpower left, and can't reroll dice"])
    var last_roll = database.rolls.get(author.name)
    // Check that the dice haven't changed
    expect(last_roll.dice).toEqual([6,5,2,6,10,1])
})


test('reroll only rerolls 3 dice ', () =>{
    var author = new fake.Author('reroll_top_3')
    var msg = author.msg("!reroll")
    
    test_reroll_cmd(author,
                    "!reroll",
                    [8,4,1,2,3,4,5], // the 4 and 5 should be preserved
                    [6,7,8,9,10], // the 9 and 10 should not be used
                    [{
                        embed: {
                            color: 33823,
                            title: "Success",
                            description: "7d10 vs 3 with 2 Hunger.",
                            fields: [
                                {
                                    name: "Margin",
                                    value: "Successes: 4\nMargin: 1",
                                },
                                {
                                    name: "Hunger Dice",
                                    value: "8,4",
                                },
                                {
                                    name: "Dice",
                                    value: "4,5,6,7,8",
                                },
                            ],
                        },
                    }])
})
