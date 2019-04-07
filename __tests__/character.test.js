// Mock to import the in memory database
jest.setMock('../database', require('../database/db.mock'));

const Character = require('../character')
const database = require('../database')
var rules = require('../rules')

test('find should fail if player does not have a character', () => {
    expect(Character.find('no player')).toBe(undefined);
})

test('Create save and find a character', () => {
    var character = new Character('Alucard', 'a player')
    character.sheet.strength = 3
    character.sheet.brawl = 4
    character.add_speciality('brawl','martial arts')
    character.sheet.melee = 3
    character.add_speciality('melee','knifes')

    var out = character.add_advantage('wrong',2)
    expect(out).toEqual(`wrong is not a real advantage.`)
    expect(character.advantages).toEqual({})
    // Invalid amount of points
    out = character.add_advantage('iliterate', 0)
    expect(out).toEqual(`0 is not a valid number of points for iliterate`)
    expect(character.advantages).toEqual({})
    // Using the default points on an advantage that can have multiple values
    rules.advantages.allies.points = [1,2,3] // Mock the value of the points of the advantage we will use, to make the test pass even without the correct rules info
    character.add_advantage('allies')
    expect(character.advantages).toEqual({
        allies:{
            points:1,
            specification:null
        }
    })
    // Adding an advantage that already exists with a different value should overide it
    character.add_advantage('allies', 2)
    expect(character.advantages).toEqual({
        allies:{
            points:2,
            specification:null
        }
    })
    
    character.save()
    var character_loaded = Character.find('a player')
    expect(character_loaded).toEqual(character);
    // If I delete the character it should not find it anymore 
    database.character.delete(character.sheet.id)
    expect(Character.find('a player')).toBe(undefined);
})


test('Get attr skill and discipline', () => {
    var character = new Character('attr_skill_dis_test', 'attr_skill_dis_test player')
    character.sheet.strength = 3
    character.sheet.brawl = 4
    character.sheet.potence = 2

    expect(character.get('strength')).toBe(3)
    expect(character.get('str')).toBe(3)

    expect(character.get('brawl')).toBe(4)
    expect(character.get('bra')).toBe(4)

    expect(character.get('potence')).toBe(2)
})

test('character speciality', () => {
    var character = new Character('speciality_test', 'speciality_test player')
    character.sheet.strength = 3
    character.sheet.brawl = 4
    character.sheet.potence = 2

    var ret = character.add_speciality('wrong', 'speciality')
    expect(ret).toEqual('Unknown skill wrong')

    ret = character.add_speciality('sci', 'speciality name')
    expect(ret).toEqual(`Character ${character.sheet.name} doesn't have the skill science, so you can't pick a speciality for it`)
    
    // If character hasn't been saved yet it should be saved when adding a speciality so it has an id
    expect(character.sheet.id).toBe(null)
    ret = character.add_speciality('bra', 'speciality name')
    expect(character.sheet.id).not.toBe(null)
    expect(ret).toEqual(character.sheet.name + ' now has a speciality "speciality name" for brawl')
    // Reload the character and check if it is there
    character = Character.find('speciality_test player')
    expect(character.specialities).toEqual({
        brawl: ['speciality name']
    })

    // Removing a wrong speciality should return an error
    ret = character.remove_speciality('wrong')
    expect(ret).toEqual(`${character.sheet.name} does not have the "wrong" speciality for any skill`)

    // Removing something that actually exists should remove it
    ret = character.remove_speciality('speciality name')
    expect(ret).toEqual(`${character.sheet.name} no longer has the "speciality name" speciality for brawl`)
    // Reload the character and check if it's vanished
    character = Character.find('speciality_test player')
    expect(character.specialities).toEqual({})
})

test('getters for sheet', () => {
    var character = new Character('speciality_test', 'speciality_test player')
    character.sheet.strength = 3
    character.sheet.brawl = 4
    character.sheet.potence = 2

    var attributes = character.get_attributes()
    var skills = character.get_skills()
})
