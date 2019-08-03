var express = require('express');
var router = express.Router();

var User = require('../../models/user')


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send(req.session.user);
});

module.exports = router;
