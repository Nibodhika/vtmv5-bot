const database = require('../db.mock')
const rules = require('../../rules')

function create_and_save_character(name){
    character = {
        id: null,
        name: name,
        player: name + " player",
        concept: 'this is concept',
        predator: 'predator type',
        sire: 'Dracula',
        clan: 'Ventrue',
        generation: 4,
        resonance: '-',

        hunger: 1,
        health: 2,
        h_superficial: 3,
        h_aggravated: 4,
        willpower: 5,
        w_superficial: 6,
        w_aggravated: 7,
        humanity: 8,
        stains: 9,
        blood_potency: 0,
    }
    for(var attr in rules.attributes){
        character[attr] = 1;
    }
    for(var skill in rules.skills){
        character[skill] = 0;
    }
    for(var discipline in rules.disciplines){
        character[discipline] = 0;
    }
    character.id = database.character.save(character)
    return character
}

test('character save and load', () => {
    var character = create_and_save_character('Database test')
    expect(character.id).not.toBe(undefined);
    var loaded_character = database.character.get(character.name)
    expect(loaded_character).toEqual(character);
})


test('health', () => {
    var character = create_and_save_character('Health test')
    var name = character.name
    var player = character.player
    character.health = 8
    character.h_superficial= 5,
    character.h_aggravated= 2,
    database.character.save(character)

    // Wrong player should return undefined
    expect(database.health.get('does not exist')).toBe(undefined)
    
    health = database.health.get(player)
    expect(health.health).toBe(8)
    expect(health.h_superficial).toBe(5)
    expect(health.h_aggravated).toBe(2)

    // If an unknown player is givin it should return undefined
    expect(database.health.set_total(`wrong`, 6)).toBe(undefined)
    // If not a number is given it should return undefined
    expect(database.health.set_total(player, 'not number')).toBe(undefined)
    
    expect(database.health.set_total(player, 6)).toBe(6)
    expect(database.health.set_superficial(player, 1)).toBe(1)
    expect(database.health.set_aggravated(player, 3)).toBe(3)
    health = database.health.get(player)
    expect(health.health).toBe(6)
    expect(health.h_superficial).toBe(1)
    expect(health.h_aggravated).toBe(3)

    // If less than 0 it should return 0
    expect(database.health.set_total(player, -2)).toBe(0)
    health = database.health.get(player)
    expect(health.health).toBe(0)

    // We're healing 2 points, but we only have one damage
    expect(database.health.heal_superficial(player, 2)).toBe(0)
    // We're healing 2 points of the 3, should have been set to 1
    expect(database.health.heal_aggravated(player, 2)).toBe(1)
    health = database.health.get(player)
    expect(health.h_superficial).toBe(0)
    expect(health.h_aggravated).toBe(1)

    // Attempting to heal not a number should not work
    expect(database.health.heal_aggravated(player, 'not number')).toBe(undefined)

    // Damage test
    expect(database.health.superficial_damage(player, 2)).toBe(2)
    expect(database.health.aggravated_damage(player, 2)).toBe(3)
    health = database.health.get(player)
    expect(health.h_superficial).toBe(2)
    expect(health.h_aggravated).toBe(3)

    // Attempting to damage not a number should not work
    expect(database.health.aggravated_damage(player, 'not number')).toBe(undefined)

})

test('hunger', () => {
    var character = create_and_save_character('Hunger test')
    var player = character.player
    character.hunger = 4
    database.character.save(character)

    // Wrong player should return undefined
    expect(database.hunger.get('does not exist')).toBe(undefined)
    
    var hunger = database.hunger.get(player)
    expect(hunger).toBe(4)

    database.hunger.set(player, 5)
    hunger = database.hunger.get(player)
    expect(hunger).toBe(5)
    
    database.hunger.decrease(player)
    hunger = database.hunger.get(player)
    expect(hunger).toBe(4)

    database.hunger.decrease(player,3)
    hunger = database.hunger.get(player)
    expect(hunger).toBe(1)

    database.hunger.increase(player)
    hunger = database.hunger.get(player)
    expect(hunger).toBe(2)

    database.hunger.increase(player,2)
    hunger = database.hunger.get(player)
    expect(hunger).toBe(4)
})


test('specialty', () => {
    var character = create_and_save_character('specialty test')
    database.specialties.set(character.id,'knife','melee')
    database.specialties.set(character.id,'sword','melee')
    database.specialties.set(character.id,'martial arts','brawl')
    var specialties = database.specialties.get(character.id)
    expect(specialties).toEqual({
        melee: ['knife', 'sword'],
        brawl: ['martial arts']
    })

    database.specialties.delete(character.id)
    specialties = database.specialties.get(character.id)
    expect(specialties).toEqual({})


    var saved = {
        athletics:['jump'],
        intimidation:['force']
    }
    // This entry should be deleted when save is called
    database.specialties.set(character.id,'elysium','etiquette')
    database.specialties.save(character.id,saved)
    specialties = database.specialties.get(character.id)
    expect(specialties).toEqual(saved)
})
