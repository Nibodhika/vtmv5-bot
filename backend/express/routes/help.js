var express = require('express');
var router = express.Router();

var Help = require('../../models/help')

router.get('/:topic?/:specification?', function(req, res, next) {
    var topic = req.params.topic
    var specification = req.params.specification
    res.send(Help.get(topic,specification));
});

module.exports = router;
