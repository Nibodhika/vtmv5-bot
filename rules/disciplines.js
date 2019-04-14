module.exports = {
    animalism: {
        description: "Supernatural affinity with and control of animals",
        powers:{
            bond_famulus: {
                level: 1,
                description: `When Blood Bonding an animal, the vampire can make it a famulus, forming a mental link with it and facilitating the use of other Animalism powers. While this power alone does not allow two-way communication with the animal, it can follow simple verbal instructions such as “stay” and “come here." It attacks in defense of itself and its master but cannot otherwise be persuaded to fight something it would not normally attack`,
                pool:"charisma+animal_ken",
                rouse_check: 0,
            },
            sense_the_beast:{
                level: 1,
                description: `The vampire can sense the Beast present in mortals, vampires, and other supernaturals, gaining a sense of their nature, hunger, and hostility.`,
                pool: "resolve+animalism"
            }

            
        }
    },
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
