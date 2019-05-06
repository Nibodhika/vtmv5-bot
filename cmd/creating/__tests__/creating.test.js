// Mock to import the in memory database
jest.setMock('../../../database', require('../../../database/db.mock'));

var creating = require('../index.js')
var step = require('../steps')
var step_msg = require('../step_msg')
var database = require('../../../database')
var Character = require('../../../character')
var rules = require('../../../rules')

var fake = require('../../mocks.js')


function check_step(author, content, expected_step, fail_msg = undefined){
    var msg = author.msg(content)
    creating(msg, false)
    var character = Character.find(author);

    var expected_msg = step_msg(expected_step, character)
    if(fail_msg != undefined)
        expected_msg = fail_msg

    // Check replies
    expect(author.get_replies()).toEqual([expected_msg])
    // Check step in database
    expect(database.creation.get_step(author)).toBe(expected_step)
}


test('creation', () => {
    var author = new fake.Author('creation test')

    var msg = author.msg('test')
    // Sending a message that didn't trigger the character creation should respond with an error that we're not creating a character yet
    creating(msg, false)
    expect(author.get_replies()).toEqual([
        "It seems you are not creating a character yet, first send the !create command"])
    // Test that we're clearing the replies when we get_replies
    expect(author.get_replies()).toEqual([])

    // First time creating a character, welcome step should be to ask the name
    creating(msg, true)
    expect(author.get_replies()).toEqual([step_msg(step.NAME, undefined)])

    

    check_step(author,'My Name test',step.CONCEPT)
    check_step(author,'My concept test',step.CLAN)
    check_step(author,'wrong clan',step.CLAN, 'Unknown clan, select one from the list before')
    check_step(author,'brujah',step.ATTRIBUTE_4)

    check_step(author,'wrong',step.ATTRIBUTE_4,`wrong is not a valid attribute`)
    check_step(author,'str',step.ATTRIBUTE_3)

    check_step(author,'str',step.ATTRIBUTE_3, `Please select exactly 3 attributes`)
    check_step(author,'dex,str,sta',step.ATTRIBUTE_3, `strength has already been chosen to have 4 dots`)
    var character = Character.find(author);
    expect(character.sheet.health).toBe(4)
    check_step(author,'dex,sta,cha',step.ATTRIBUTE_2)
    // Should update the health to 6, because stamina is now 3
    character = Character.find(author);
    expect(character.sheet.health).toBe(6)
    var character = Character.find(author);
    expect(character.sheet.willpower).toBe(2)
    check_step(author,'man,com,int,wits',step.SKILL_DISTRIBUTION)
    // Should have updated willpower to 3, because composure is 2 and resolve is 1
    character = Character.find(author);
    expect(character.sheet.willpower).toBe(3)

    check_step(author,'wrong',step.SKILL_DISTRIBUTION, "wrong is not a valid skill distribution, please select one from the list above")
    check_step(author,'jack of all trades',step.JACK_3)

    check_step(author,'wrong',step.JACK_3,`wrong is not a valid skill`)
    check_step(author,'athletics',step.JACK_2)
    check_step(author,'athletics',step.JACK_2,`Please select exactly 8 skills`)
    check_step(author,'athletics,brawl,craft,drive,firearms,larceny,melee,stealth',step.JACK_2,`athletics has already been chosen to have 3 dots`)
    check_step(author,'brawl,craft,drive,firearms,larceny,melee,stealth,survival',step.JACK_1)
    //should skilp academics because it's 0
    check_step(author,'animal,etiquette,insight,intimidation,lead,performance,persuasion,streetwise,subterfuge,awareness',step.SPECIALTY_CRAFT)

    check_step(author,'this is a craft specialty', step.SPECIALTY_PERFORMANCE)
    // Now we jump science because it's 0 and go to the free specialty
    check_step(author,'this is a performance specialty', step.SPECIALTY)

    check_step(author,'wrong', step.SPECIALTY,'You need to specify a skill and then a specialty, e.g. melee knifes')

    check_step(author,'wrong knifes', step.SPECIALTY,`Unknown skill wrong`)

    check_step(author,'occult werewolves',step.SPECIALTY,`character has 0 points in occult, choose a specialty for a skill he has at least one point`)

    check_step(author,'melee knifes', step.DISCIPLINES_2)

    check_step(author,'dominate', step.DISCIPLINES_2, 'dominate is not a valid discipline for your character at creation, please select one from the list above')

    // TODO need to include the powers for the disciplines
    
    // check_step(author,'potence', step.DISCIPLINES_1)
    // check_step(author,'potence', step.DISCIPLINES_1, 'You already chose that discipline to have 2 dots')

    // check_step(author,'celerity', step.PREDATOR)

    // check_step(author,'wrong', step.PREDATOR, "wrong is not a valid predator type, choose one from the list above")

    // check_step(author,'alleycat', step.PREDATOR_CHARACTERISTIC_1)
    
    // check_step(author,'wrong', step.PREDATOR_CHARACTERISTIC_1,`Please select one of the specialties listed before`)

    // check_step(author,'intimidation stickups', step.PREDATOR_CHARACTERISTIC_2)

    // check_step(author,'wrong', step.PREDATOR_CHARACTERISTIC_2, `Please select one of the disciplines listed before`)

    // check_step(author,'celerity', step.ADVANTAGES_MERIT)

    //check_step(author,'wrong', step.ADVANTAGES_MERIT, '')
})


test('confirm character deletion', () => {
    var author = new fake.Author('deletion')
    var msg = author.msg('test')
    creating(msg, true)
    expect(author.get_replies()).toEqual([step_msg(step.NAME, undefined)])

    check_step(author,'A name to delete',step.CONCEPT)
    
    // This should have created the character
    var character = Character.find(author);
    expect(character).not.toBe(undefined)

    // If we start the creation again, it should show the delete message
    creating(msg, true)
    expect(author.get_replies()).toEqual([step_msg(step.DELETE_CHARACTER, character)])

    check_step(author,'wrong',step.DELETE_CHARACTER, "wrong is not a valid response")

    check_step(author,'y',step.NAME)
    // At this point the first character should have been deleted
    var character2 = Character.find(author);
    expect(character2).toBe(undefined)
    
    var new_name = 'name after deletion'
    check_step(author,new_name,step.CONCEPT)
    // At this point we should be able to find the new character
    character2 = Character.find(author);
    expect(character2).not.toEqual(character)
    expect(character2.sheet.name).toEqual(new_name)

    // If we start the creation again, it should show the delete message
    creating(msg, true)
    expect(author.get_replies()).toEqual([step_msg(step.DELETE_CHARACTER, character2)])

    check_step(author,'n',step.BEFORE, "Aborting character creation")
    // Since we aborted at this time it should still be character2
    var character3 = Character.find(author);
    expect(character3).toEqual(character2)
})


test('create thin_blood', () => {
    var author = new fake.Author('thin_blood test')

    var msg = author.msg('test')
    // First time creating a character, welcome step should be to ask the name
    creating(msg, true)
    expect(author.get_replies()).toEqual([step_msg(step.NAME, undefined)])

    check_step(author,'My Thin_Blood test',step.CONCEPT)
    check_step(author,'My concept test',step.CLAN)
    check_step(author,'thin_blood',step.ATTRIBUTE_4)
    check_step(author,'str',step.ATTRIBUTE_3)
    check_step(author,'dex,sta,cha',step.ATTRIBUTE_2)
    check_step(author,'man,com,int,wits',step.SKILL_DISTRIBUTION)
    check_step(author,'specialist',step.SPECIALIST_4)
    check_step(author,'athletics',step.SPECIALIST_3)
    check_step(author,'brawl,craft,drive',step.SPECIALIST_2)
    check_step(author,'firearms,larceny,melee',step.SPECIALIST_1)
    //should skip specialty for academics because it's 0
    check_step(author,'stealth,survival,animal', step.SPECIALTY_CRAFT)
    
    check_step(author,'this is a craft specialty', step.SPECIALTY)
    check_step(author,'melee knifes', step.ADVANTAGES_MERIT)

    check_step(author,'wrong', step.ADVANTAGES_MERIT, 'wrong is not a valid advantage')
        
    rules.advantages.vegan.flaw = true // Mock the value of the points of the advantage we will use, to make the test pass even without the correct rules info
    check_step(author,'vegan', step.ADVANTAGES_MERIT, 'vegan is a flaw, select only merits now')

    check_step(author,'stunning:2', step.ADVANTAGES_MERIT, '2 is not a valid number of points for stunning')

    rules.advantages.stunning.points = [6]
    rules.advantages.allies.points = [1,2]
    check_step(author,'stunning;allies:2:relaiability 1 effectivenes 1', step.ADVANTAGES_MERIT, 'You can only use 7 points at most, you used 8')

    rules.advantages.stunning.points = [4]
    check_step(author,'stunning;allies:2:relaiability 1 effectivenes 1', step.ADVANTAGES_MERIT_CONFIRM_UNSPENT)

    check_step(author,'n',
               step.ADVANTAGES_MERIT,
               "Ok, let's try advantages step again, all your advantages have been deleted")

    check_step(author,'stunning;allies:2:relaiability 1 effectivenes 1',
step.ADVANTAGES_MERIT_CONFIRM_UNSPENT)

    check_step(author,'y',
               step.ADVANTAGES_FLAWS)

    // After all this we should make sure our character only has the last advantages we putted in
    character = Character.find(author);
    expect(character.advantages).toEqual({
        stunning:{
            points: 4,
            specification:""
        },
        allies:{
            points:2,
            specification:"relaiability 1 effectivenes 1"
        }
    })


    check_step(author,'wrong', step.ADVANTAGES_FLAWS, 'wrong is not a valid advantage')
    // testing an empty message
    check_step(author,'', step.ADVANTAGES_FLAWS, ' is not a valid advantage')
    check_step(author,'beautiful', step.ADVANTAGES_FLAWS, 'beautiful is a merit, select only flaws now')

    rules.advantages.iliterate.points = [4]
    rules.advantages.iliterate.flaw = true
    check_step(author,'iliterate:1', step.ADVANTAGES_FLAWS, '1 is not a valid number of points for iliterate')

    rules.advantages.iliterate.points = [1]
    check_step(author,'iliterate', step.ADVANTAGES_FLAWS, 'You need to select at least 2 points, you used 1')

    rules.advantages.repulsive.points = [2]
    rules.advantages.repulsive.flaw = true
    check_step(author,'iliterate;repulsive', step.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT)

    check_step(author,'n',
               step.ADVANTAGES_FLAWS,
               "Ok, let's try flaws step again, all your flaws have been deleted")

    check_step(author,'iliterate;repulsive:2:really ugly', step.ADVANTAGES_FLAWS_CONFIRM_OVERSPENT)

    check_step(author,'y',step.THIN_BLOOD_MERITS)
    
    // After all this we should make sure our character only has the last advantages we putted in
    character = Character.find(author);
    expect(character.advantages).toEqual({
        stunning:{
            points: 4,
            specification:""
        },
        allies:{
            points:2,
            specification:"relaiability 1 effectivenes 1"
        },
        iliterate:{
            points: 1,
            specification:""
        },
        repulsive:{
            points:2,
            specification:"really ugly"
        }
    })


    check_step(author,'wrong',step.THIN_BLOOD_MERITS, 'wrong is not a valid thin blood advantage')
    check_step(author,'day_drinker;discipline_affinity;lifelike;thin_blood_alchemist',step.THIN_BLOOD_MERITS, 'You can select up to 3 merits')

    check_step(author,'day_drinker;discipline_affinity:potence;lifelike',step.THIN_BLOOD_FLAWS)

    character = Character.find(author);
    expect(character.thin_blood_adv).toEqual({
        day_drinker: "",
        discipline_affinity:"potence",
        lifelike:""
    })


    check_step(author,'wrong;wrong;wrong',step.THIN_BLOOD_FLAWS, 'wrong is not a valid thin blood advantage')
    check_step(author,'baby_teeth',step.THIN_BLOOD_FLAWS, 'You need to select 3 flaws, the same amount of merits you selected')

    rules.thin_blood_adv.branded_by_the_camarilla.flaw = true
    rules.thin_blood_adv.dead_flesh.flaw = true
    check_step(author,'branded_by_the_camarilla;dead_flesh;vampiric_resilience',
               step.THIN_BLOOD_FLAWS, 'vampiric_resilience is a merit, select only flaws now')

    rules.thin_blood_adv.baby_teeth.flaw = true
    rules.thin_blood_adv.clan_curse.flaw = true
    check_step(author,'baby_teeth;clan_curse:brujah;dead_flesh',
               step.CONVICTIONS_TOUCHSTONES)

    character = Character.find(author);
    expect(character.thin_blood_adv).toEqual({
        day_drinker: "",
        discipline_affinity:"potence",
        lifelike:"",
        baby_teeth:"",
        clan_curse:"brujah",
        dead_flesh:""
    })

    check_step(author,'one:one;two:two;three:three;four:four',step.CONVICTIONS_TOUCHSTONES, 'You can select up to 3 convictions')

    check_step(author,"don't kill:his wife;wrong;spare innocents:his son",step.CONVICTIONS_TOUCHSTONES, 'Each conviction needs a touchstone, and only one touchstone, e.g. the guilty should suffer:Francis, a judge')

    check_step(author,"don't kill:his wife;spare innocents:his son",step.FINISH)
    
})
