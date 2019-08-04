Vtmv5-bot is a Vampire the Masquerade 5th edition bot for discord written in Node.

For information on how to use the bot refer to the wiki, this readme is just about setting up the bot.

# Token authorization

In order for the bot to connect to discord you will need to first create a bot and get it's token, then create a file called config.json with the contents:

```json
{
 "token": "your token goes here",
 "tenets": [
    "First campaign tenet goes here",
    "Second campaign tenet goes here",
    "Third campaign tenet goes here",
    ]
}

```

# Dependencies installation

To install the dependencies run `npm install`

# GM Role

In the channel where you want to run your game some commands are only available to members that have the GM role, so be sure to create the role and give it to yourself in order to be able to edit characters sheet

# Rules

Because of authorial rights I will not include the attributes, skills, advantages and disciplines that are required to run the bot, so in order to use this bot you will need to implement those files. All of the following files are meant to be placed inside the rules folder.

## attributes.js

This file should contain the information about attributes, each entry should use the name as a key and have a description, list of alias and a type (physical, social or mental), an example of this file is presented below:

```javascript
module.exports = {
    strength:{
        description: "This is the description to the strength attribute",
        alias: ['str'], // str is a common way to refer to strength
        type: 'physical'
    }
}
```

## skills.js

This file should contain the information about skills, each entry should use the name as a key and have a description, list of alias, type (physical, social or mental) and a list of example specializations, an example of this file is presented below:

```javascript
module.exports = {
    skill_name:{
        description: "this is the description of this skill",
        alias: ['ski', 'skina'],
        type: 'social',
        specializations: ['Skill test', 'Another specialization']
    }
}
```

## advantages.js

This file should contain the information about advantages, each entry should use the name as a key and have a description, list of points and a boolean saying if it's a flaw, an example of this file is presented below:

```javascript
module.exports = {
    this_is_a_flaw:{
        description: "This is a 2 points flaw",
        points: [2],
        flaw: true
    },
    this_is_a_merit:{
        description: "This merit can be purchase with either 1, 2 or 3 points",
        points: [1,2,3],
        flaw: false
    }
}
```

## thin_blood_adv.js

This file should contain the information about Thin Blood Advantages, similar to advantages file, except these advantages have no points.

## blood_potency.js

This file should contain the information about the blood potency table in page 216. It's a list where the index represents the blood potency, an example of this file is presented below:

```javascript
module.exports = [
    {
        blood_surge: 1, // How many dice are added when performing a blood surge
        damage_mend: 2, // How many points of superficial damage are mended by a single rouse check
        discipline_bonus: 3, // How many dice are added when using a discipline
        discipline_rouse_check_reroll: 4, // Allows you to reroll the rouse check for disciplines of this level and below
        bane_severity: 5, // Level of clan bane severity
        feeding_penalty:{
            animal: 1, // This is a multiplier, so animal: 0.5 means animal blood only slakes half the hunger
            bagged: 1, // same as animal
            human: 0, // This is a penality, so human:1 means human blood slakes 1 less hunger than it should
            min_hunger_no_kill: 1 // This is the minimum amount of hunger you can have without having to kill
        }
    }
]
```

## clans.js

This file should contain the information about the clans, each entry should use the name of the clan as a key and have a description, list of disciplines and a bane with the description of the bane, an example of this file is presented below:

```javascript
module.exports = {
    clan_name:{
        description: "This is the description of the clan",
        disciplines: ['discipline1', 'discipline2', 'discipline3'],
        bane: "This is a description of the bane of the clan"
    }
}
```

## disciplines.js

This file should contain the list of disciplines, each entry should use the name of the discipline as a key and be a description, an example of this file is presented below:

```javascript
module.exports = {
    discipline_name:"Discipline description"
}
```

## powers.js

**So far this file is not used**

This file should contain the list of powers, the name of the power is the key and have a format similar to this:

```javascript
module.exports = {
    power_name:{
        requirements:{
            discipline1: 2, // Requires level 2 of discipline1
            discipline2: 1, // Requires level 1 of discipline2
        },
        description: "The description of the power",
        pool: ["strength+athletics", "strength+discipline1"], // A list of the possible pools used by this power
        resist: "", // Resist pool when the power is used against someone, or empty string for no resist test
        rouse_check: 0, // Amount of rouse checks needed to be performed to activate the power
    }
}
```

## predator_type.js

This file should contain the list of predator types, the name of the predator type is the key and each entry has a description and a list of characteristics, an example of the file is presented below:

```javascript
module.exports = {
    predator_type:{
        description: "The description of the predator type",
        characteristics:[
        "add a speciality: skill (speciality) or another_skill (another speciality)",
        "Gain one dot of discipline",
        "Gain the merit merit_name"
        ] 
    }
}
```

## humanity.js

This file contains a list of characteristics for a given level of humanity

```javascript
module.exports = [
   // 0
   [
   "Vampires at 0 humanity have this characteristic",
   "They can do this",
   ],
   // 1
   [
   "At 1 humanity the vampire can no longer do this",
   ]
]
```
