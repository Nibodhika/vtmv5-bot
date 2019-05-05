const help = require('./help.js').help_cmd
const roll = require('./roll.js').cmd
const reroll = require('./reroll.js')
const hunger = require('./hunger.js')
const health = require('./health.js')
const willpower = require('./willpower.js')
const character = require('./character.js')
const create = require('./creating')
const convictions = require('./convictions')
const specialities = require('./specialities')
const rouse = require('./rouse')
const frenzy = require('./frenzy')
const status = require('./status')

module.exports = {
    help: help,
    roll: roll,
    reroll: reroll,
    hunger: hunger,
    health: health,
    willpower: willpower,
    character: character,
    create: create,
    convictions: convictions,
    specialities: specialities,
    rouse: rouse,
    frenzy: frenzy,
    status: status,
}
