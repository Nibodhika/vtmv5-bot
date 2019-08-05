var express = require('express');
var router = express.Router();

var rules = require('../../rules')

router.get('/*', function(req, res, next) {
    
    var params = req.params[0].split('/').filter(Boolean);
    
    var r = rules;
    for(var i in params){
        var p = params[i]
        if(p in r)
            r = r[p]
        else{
            res.status(500).send("Unknown")
            return
        }
    }

    if(typeof r === 'object' && ! Array.isArray(r))
        res.send(Object.keys(r));
    else
        res.send(r)
});



module.exports = router;
