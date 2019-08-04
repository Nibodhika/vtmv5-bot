var express = require('express');
var router = express.Router();

var User = require('../../models/user');


// Check authentication and either go to where the user was trying to go or render login with error
router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    console.log("Received a login from: " + username + " with " + password)
    var user = User.authenticate(username, password);
    if(user != undefined){
        console.log("Logged in " + username)
        req.session.user = user
        res.send(user)
    }
    else{
        console.log("Could not login " + username)
        res.sendStatus(403)
    }
});

// Note that this means everything from now on requires login
router.use(function(req, res, next){
    if(!req.session.user){
        res.sendStatus(403)
    }
    else
        next()
})

// Simple function to check if we're logged in
router.get('/login',function(req,res){
    res.send(req.session.user)
})

// Delete the user from the session
router.get('/logout', function(req, res) {
    delete req.session.user;
    res.sendStatus(200)
});

// Index
// router.use('/user', require('./user'));
router.use('/character', require('./character'));


module.exports = router;
