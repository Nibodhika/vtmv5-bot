
const help = require('../help')
var fake = require('../mocks.js')
var rules = require('../../rules')

function check_cmd(author, command, expected_answer, as_gm){
    fake.check_cmd(help.help_cmd, author, command, expected_answer)
}

test('base', () => {
    var author = new fake.Author('base help test')
    check_cmd(author,
                  "!help",
                  help.help_str)
    
    check_cmd(author,
                  "!help wrong",
                  `I don't know about "wrong"`)
})

test('clan', () => {
    var author = new fake.Author('clan help test')

    var clan_reply = "The clan represents the vampire bloodline, available clans are:\n"
     for(var clan in rules.clans){
         clan_reply += '- ' + clan + '\n'
     }
    // Should work with both clan and clans
    check_cmd(author,
                  "!help clans",
                  clan_reply
                 )
    check_cmd(author,
                  "!help clan",
                  clan_reply
                 )

    check_cmd(author,
                  "!help clan wrong",
                  `Unknown clan wrong`
                 )

    // For one of the normal clans the answer should be the description and disciplines
    var clan = rules.clans['brujah']
    var brujah_reply = clan.description
    brujah_reply += '\nClan disciplines are '+clan.disciplines
    check_cmd(author,
                  "!help clan brujah",
                  brujah_reply
                 )

    // For thin blood they have access to thin blood alchemy
    var clan = rules.clans['thin_blood']
    var thin_blood_reply = clan.description
    thin_blood_reply += "\nThin blood don't have clan disciplines but instead have access to " + clan.disciplines
    check_cmd(author,
                  "!help clan thin_blood",
                  thin_blood_reply
                 )

    // Caitiff have no disciplines
    var clan = rules.clans['caitiff']
    var caitiff_reply = clan.description
    caitiff_reply += '\nCaitiff can pick any two disciplines, but they count as non-clan for xp purchase cost'
    check_cmd(author,
                  "!help clan caitiff",
                  caitiff_reply
                 )
    
})


function do_test_attr_skill(
    what,
    expected_names,
    dict,
) {
    var author = new fake.Author( what + 'help test')

    var reply = `Available ${what}s (and alias) are:`
    for(var elem in dict){
        reply += '\n-  ' + elem + " ("+dict[elem].alias+")"
    }

    for(var i in expected_names){
        check_cmd(author,
                      "!help "+expected_names[i],
                      reply
                     )
    }

    reply = `Unknown ${what} wrong`
    check_cmd(author,
                  "!help "+expected_names[0] + " wrong",
                  reply
                 )

    var elem = Object.keys(dict)[0]
    reply = dict[elem].description
    reply += `\n\nAlias: ` + dict[elem].alias
    check_cmd(author,
                  "!help "+expected_names[0] + " " + elem,
                  reply
                 )
    // it should also work with an alias
    check_cmd(author,
                  "!help "+expected_names[0] + " " + dict[elem].alias[0],
                  reply
                 )
    
}

test('attribute', () => {
    do_test_attr_skill(
        'attribute',
        ['attributes', 'attribute', 'attr'],
        rules.attributes
    )
})

test('skills', () => {
    do_test_attr_skill(
        'skill',
        ['skills', 'skill'],
        rules.skills
    )
})
