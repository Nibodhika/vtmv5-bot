module.exports.clans = {
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
