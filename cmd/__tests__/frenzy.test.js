jest.setMock('../../database', require('../../database/db.mock'));

const fake = require('../mocks.js')
const Character = require('../../character')
const frenzy_cmd = require('../frenzy')

function check_cmd(author,content,dice,expected_result){
    fake.dice_cmd_check(frenzy_cmd, author,content,dice,expected_result)
}

test('frenzy', () => {
    var author = new fake.Author('frenzy_cmd_test')

    check_cmd(author,
              '!frenzy',
              [2],
              `No character information for ${author.name}`
             )

    // Create the character
    var character = new Character('frenzy_cmd_test_char', author.name)
    character.sheet.willpower = 2
    character.sheet.humanity = 7
    character.save()

    check_cmd(author,
              '!frenzy',
              [3,4,5,1,6],
              {
                  embed: {
                      color: 16711680,
                      description: "3,4,5,1",
                      title: "You succumb to the frenzy"
                  }})

    // More willpower should increase the dice rolled by 1
    character.sheet.willpower = 3
    character.save()

    check_cmd(author,
              '!frenzy',
              [3,4,5,1,6],
              {
                  embed: {
                      color: 33823,
                      description: "3,4,5,1,6",
                      title: 'You avoid the frenzy, but take must take a turn to recompose'
                  }})


    // Humanity should be divideb by 3 and rounded down, so humanity 6 should still roll the same amount of dice
    character.sheet.humanity = 6
    character.save()

    check_cmd(author,
              '!frenzy',
              [3,4,5,1,6],
              {
                  embed: {
                      color: 33823,
                      description: "3,4,5,1,6",
                      title: 'You avoid the frenzy, but take must take a turn to recompose'
                  }})

    // Decreasing humanity to 5 should decrease the amount of dice rolled
    character.sheet.humanity = 5
    character.save()

    check_cmd(author,
              '!frenzy',
              [10,10,5,1,6],
              {
                  embed: {
                      color: 65280,
                      description: "10,10,5,1",
                      title: 'You avoid the frenzy'
                  }})


    // Testing a frenzy with different difficulty
    check_cmd(author,
              '!frenzy 2',
              [3,4,5,6,7],
              {
                  embed: {
                      color: 16711680,
                      description: "3,4,5,6", // One success still fails frenzy test
                      title: "You succumb to the frenzy"
                  }})


    
})
