const clans = {
    brujah:{
        description: ' The Rabble rebel against power and rage against tyranny.',
        disciplines: ['celerity', 'potence', 'presence'],
        bane: `The Blood of the Brujah simmers with barely contained rage, exploding at the slightest provocation. Subtract dice equal to the Bane Severity of the Brujah from any roll to resist fury frenzy. This cannot take the pool below one die`
    },
    gangrel:{
        description: 'The feral Outlanders blend vampire and beast.',
        disciplines: ['animalism', 'fortitude', 'protean'],
        bane: `Gangrel relate to their Beast much as other Kindred relate to the Gangrel: suspicious partnership. In frenzy, Gangrel gain one or more animal features: a physical trait, a smell, or a behavioral tic. These features last for one more night afterward, lingering like a hangover following debauchery. Each feature reduces one Attribute by 1 point – the Storyteller may decide that a forked tongue or bearlike musk reduces Charisma, while batlike ears reduce Resolve (“all those distracting sounds”). If nothing immediately occurs to you, the feature reduces Intelligence or Manipulation. The number of features a Gangrel manifests equals their Bane Severity. If your character Rides the Wave of their frenzy (see p. 219) you can choose only one feature to manifest, thus taking only one penalty to their Attributes`
    },
    malkavian:{
        description: 'The madness of the Lunatics conceals and reveals truths.',
        disciplines: ['auspex','dominate','obfuscate'],
        bane: `Afflicted by their lineage, all Malkavians are cursed with at least one type of mental derangement. Depending on their history and the state of their mind at death, they may experience delusions, visions of terrible clarity, or something entirely different. When the Malkavian suffers a Bestial Failure or a Compulsion, their curse comes to the fore. Suffer a penalty equal to your character’s Bane Severity to one category of dice pools (Physical, Social, or Mental) for the entire scene. This is in addition to any penalties incurred by Compulsions. You and the Storyteller decide the type of penalty and the exact nature of the character’s affliction during character creation`
    },
    nosferatu:{
        description: 'The hideous Sewer Rats hide their disfigured forms in the darkness, from whence they gather secrets.',
        disciplines: ['animalism','obfuscate','potence'],
        bane: `Hideous and vile, all Nosferatu count as having the Repulsive Flaw (-2) and can never increase their rating in the Looks Merit. In addition, any attempt to disguise themselves as human incur a penalty to your dice pool equal to your character’s Bane Severity (this includes the Obfuscate powers Mask of a Thousand Faces and Impostor’s Guise)`
    },
    toreador:{
        description: 'The Degenerates seek thrills of art, romance, and cruelty amidst stagnant undeath.',
        disciplines: ['auspex','celerity','presence'],
        bane: `Toreador exemplify the old saying that art in the blood takes strange forms. They desire beauty so intensely that they suffer in its absence. While your character finds itself in less than beautiful surroundings, lose the equivalent of their Bane Severity in dice from dice pools to use Disciplines. The Storyteller decides specifically how the beauty or ugliness of the Toreador’s environment (including clothing, blood dolls, etc.) penalizes them, based on the character’s aesthetics. That said, even devotees of the Ashcan School never find normal streets perfectly beautiful. This obsession with aesthetics also causes divas to lose themselves in moments of beauty and a bestial failure often results in a rapt trance, as detailed in the Compulsion rules (p. 208)`
    },
    tremere:{
        description: 'Broken by a new Inquisition, the once-mighty Warlocks seek to restore their monopoly on sorcerous power.',
        disciplines: ['auspex','dominate','blood sorcery'],
        bane: `Once the clan was defined by a rigid hierarchy of Blood Bonds reaching from the top to the bottom of the Pyramid. But after the fall of Vienna, their Blood has recoiled and aborted all such connections. Tremere vitae can no longer Blood Bond other Kindred, though they themselves can be Bound by Kindred from other clans. A Tremere can still bind mortals and ghouls, though the corrupted vitae must be drunk an additional number of times equal to the vampire’s Bane Severity for the bond to form. Some theorize this change is the revenge of the Antediluvian devoured by Tremere, others attribute it to a simple mutation. Regardless, the clan studies
their vitae intently to discover if the process can be reversed, and, indeed, determine if they would want to do so`
    },
    ventrue:{
        description: 'The aristocratic Blue Bloods enforce the Traditions and the Masquerade on the lesser breeds.',
        disciplines: ['dominate','fortitude','presence'],
        bane: `The Ventrue are in possession of rarefied palates. When a Ventrue drinks blood from any mortal outside their preference, a profound exertion of will is required or the blood taken surges back up as scarlet vomit. Preferences range greatly, from Ventrue who can only feed from genuine brunettes, individuals of Swiss descent, or homosexuals, to others who can only feed from soldiers, mortals who suffer from PTSD, or methamphetamine users. With a Resolve + Awareness test (Dif-
ficulty 4 or more) your character can sense if a mortal possesses the blood they require. If you want your character to feed from anything but their preferred victim, you must spend Willpower points equal to the character’s Bane Severity`
    },
    caitiff:{
        description: 'The clanless show no common traits, except to find themselves outcast by vampires of distinct lineage.',
        disciplines: [],
        bane: `Untouched by the Antediluvians, the Caitiff share no common bane. Caitiff characters begin with the Suspect (•) Flaw and you may not purchase positive Status for them during character creation. The Storyteller may always impose a one or two dice penalty on Social tests against fellow Kindred who know they are Caitiff, regardless of their eventual Status. Further, to improve one of the Disciplines of a Caitiff costs six times the level purchased in experience points`
    },
    thin_blood:{
        description: 'Born too far from Caine to fully share his curse, the Mercurian thin-bloods must claw their way into the dark world – or find a way out.',
        disciplines: ['Thin-blood alchemy'],
        bane: `A thin-blood is always considered clanless and never suffers any specific clan bane or compulsion.`
    },
}

const disciplines = {
    animalism: "Supernatural affinity with and control of animals",
    auspex: "Extrasensory perception, awareness, and premonitions",
    blood_sorcery: "The use of the Blood to perform magic",
    celerity: "Supernatural quickness and reflexes",
    dominate: "Mind control practiced through one’s piercing gaze",
    fortitude: "Unearthly toughness, even to the point of resisting fire and sunlight",
    obfuscate: "The ability to remain obscure and unseen, even in crowds",
    potence: "The Discipline of physical vigor andstrength",
    presence: "The ability to attract, sway, and controlemotions",
    protean: "Shape-changing, from growing claws to melding with the earth",
    thin_blood_alchemy: "Mixing blood, emotion,and other ingredients to create powerful effects"
}

const predator_type = {
    alleycat:{
        description:'You take blood by force or threat.',
        characteristics:[
            'Add a specialty: Intimidation (Stickups) or Brawl (Grappling)',
            'Gain one dot of Celerity or Potence',
            'Lose one dot of Humanity',
            'Gain three dots of criminal Contacts'
        ]
    },
    bagger:{
        description:'You acquire preserved or dead blood, rather than hunt the living.',
        characteristics:[
            'Add a specialty: Larceny (Lockpicking) or Streetwise (BlackMarket)',
            'Gain one dot of Blood Sorcery (Tremere only) or Obfuscate',
            'Gain the Feeding Merit: Iron Gullet (•••)',
            'Gain the Enemy Flaw: (••) Either someone believes you owe them, or there’s another reason you keep off the streets.'
        ]
    },
    blood_leech:{
        description:'You feed from other vampires.',
        characteristics:[
            'Add a specialty: Brawl (Kindred) or Stealth (against Kindred)',
            'Gain one dot of Celerity or Protean',
            'Lose one dot of Humanity',
            'Increase Blood Potency by one',
            'Gain the Dark Secret Flaw: (••) Diablerist, or the Shunned Flaw: (••)',
            'Gain the Feeding Flaw: (••) Prey Exclusion (mortals)'
        ]
    },
    cleaver:{
        description:'You take blood covertly from your mortal family or friends.',
        characteristics:[
            'Add a specialty: Persuasion (Gaslighting) or Subterfuge (Coverups)',
            'Gain one dot of Dominate or Animalism',
            'Gain the Dark Secret Flaw: (•)Cleaver',
            'Gain the Herd Advantage (••)'
        ]
    },
    consensualist:{
        description:'You take blood with consent.',
        characteristics:[
            'Add a specialty: Medicine (Phlebotomy) or Persuasion (Victims)',
            'Gain one dot of Auspex or Fortitude',
            'Gain one dot of Humanity',
            'Gain the Dark Secret Flaw: (•) Masquerade Breacher',
            'Gain the Feeding Flaw: (•) Prey Exclusion (non consenting)'
        ]
    },
    farmer:{
        description:'You feed from animals.',
        characteristics:[
            'Add a specialty: Animal Ken (Specific Animal) or Survival (Hunting)',
            'Gain one dot of Animalism or Protean',
            'Gain one dot of Humanity',
            'Gain the Feeding Flaw: (••) Vegan'
        ]
    },
    osiris:{
        description:'As an object of devotion, you feed from your cult, church, or fans.',
        characteristics:[
            'Add a specialty: Occult (specific tradition) or Performance (specific entertainment field)',
            'Gain one dot of Blood Sorcery (Tremere only) or Presence',
            'Spend three dots between the Fame and Herd Backgrounds',
            'Spend two dots between the Enemies and Mythic Flaws'
        ]
    },
    sandman:{
        description:'You feed from sleeping victims, often breaking into homes.',
        characteristics:[
            'Add a specialty: Medicine (Anesthetics) or Stealth (Break-in)',
            'Gain one dot of Auspex or Obfuscate',
            'Gain one dot of Resources'
        ]
    },
    scene_queen:{
        description:'You feed from a subculture or exclusive group in which you enjoy high status.',
        characteristics:[
            'Add a specialty: Etiquette (specific scene), Leadership (specific scene), or Streetwise (specific scene)',
            'Gain one dot of Dominate or Potence',
            'Gain the Fame Advantage: (•)',
            'Gain the Contact Advantage: (•)',
            'Gain either the Influence Flaw: (•) Disliked (outside your subculture) or the Feeding Flaw: (•) Prey Exclusion (a different subculture from yours)'
        ]
    },
    siren:{
        description:'You feed by seduction, under the guise of sex.',
        characteristics:[
            'Add a specialty: Persuasion (Seduction) or Subterfuge (Seduction)',
            'Gain one dot of Fortitude or Presence',
            'Gain the Looks Merit: (••) Beautiful',
            'Gain the Enemy Flaw: (•) A spurned lover or jealous partner'
        ]
    }
}

var help_str = `Valid commands are:
!help <topic>
    Prints this help
!roll <amount> <difficulty> <hunger>
    Rolls <amount> of dice
!hunger <who>
    Check the hunger of a player`

function help_cmd(msg, args){
    var reply = help_str
    if(args.length > 1) {
        var about = args[1]
        if(about == 'clans'){
            reply = "The clan represents the vampire bloodline, available clans are:\n"
            for(var clan in help.clans){
                reply += '- ' + clan + '\n'
            }
        }
        else if(Object.keys(clans).indexOf(about) > -1){
            var clan = clans[about]
            reply = clan.description
            if(clan == 'thin_blood'){
                reply += "\nThin blood don't have clan disciplines but instead have access to " + clan.disciplines
            }
            else if(clan == 'caitiff'){
                reply += '\nCaitiff can pick any two disciplines, but they count as non-clan for xp purchase cost'
            }
            else{
                reply += '\nClan disciplines are '+clan.disciplines
            }
        }
        else if(Object.keys(disciplines).indexOf(about) > -1){
            var reply = disciplines[about];
        }
    }
    msg.reply('\n'+reply);
}

module.exports.clans = clans
module.exports.disciplines = disciplines
module.exports.predator_type = predator_type
module.exports.help_cmd = help_cmd
