module.exports = function roll(amount, difficulty, hunger) {
    var dice = [];
    var hunger_dice = [];
    var successes = 0;
    var messy = false;
    var bestial = false;
    var tens = 0;

    for(var i = 0; i < amount; i++){
        var die = Math.floor((Math.random() * 10) + 1)
        if(die > 5){
            successes++;
            if(die == 10)
                tens++;
        }
        if(i < hunger){
            hunger_dice.push(die);
            if(die == 10)
                messy = true;
            else if(die == 1)
                bestial = true;
        }
        else
            dice.push(die);
    }
    var criticals = Math.floor(tens / 2);
    successes += criticals * 2;

    var margin = 0;
    var title = "";
    var color = 0;
    var description = amount + "d10 vs " + difficulty + " with " + hunger + " Hunger.";
    if(successes >= difficulty){
        margin = successes - difficulty;
        if(criticals > 0){
            if(messy){
                color = 16749056;
                title = 'Messy Critical!'
                //description = "Not you, but the beast succeeds";
            }   
            else{
                color = 65280;
                title = 'Critical Success!'
                //description = "You succeed with outstanding results";
            }

        }
        else{
            color = 33823;
            title = 'Success'
            //description = "You succeed"
        }
            
    }
    else{
        margin = difficulty - successes;
        if(bestial)
        {
            color = 16711680;
            title = 'Bestial Failure!'
            //description = 'You fail, and either the Beast gets angry at you, or it manifested and made you fail'
        }
        else
        {
            color = 0;
            title = 'Failure'
            //description = 'You fail'
        }
    }

    fields = [
        {
            name: "Margin",
            value: "Successes: " + successes +"\nMargin: " + margin,
        }
    ];
    if(hunger > 0)
        fields.push({
                name: "Hunger Dice",
                value: "" + hunger_dice,
        });
    fields.push({
                name: "Dice",
                value: "" + dice,
    });


    return {embed: {
        color: color,
        title: title,
        description: description,
        fields: fields
    }};
}
