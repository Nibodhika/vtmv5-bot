var express = require('express');
var router = express.Router();

var User = require('../../models/user');

// Return the login page
router.get('/login', function(req, res, next) {
    res.render('login');
});

// Check authentication and either go to where the user was trying to goor render login with error
router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var user = User.authenticate(username, password);
    if(user != undefined){
        req.session.user = user
        // Go back to the page the user was trying to access, or to /
        redirectTo = req.session.redirectTo || '/'
        res.redirect(redirectTo)
    }
    else{
        res.render('login', {errors: 'Invalid credentials'});
    }
});

// Redirect to /login if not loged in, this needs to be after the definition of get and post to login.
// Note that this means everything from now on requires login
router.use(function(req, res, next){
    if(!req.session.user){
        // Set redirectTo in the session so we know where to go back after login
        req.session.redirectTo = req.path
        res.redirect('/login');
    }
    next()
})
// Delete the user from the session
router.get('/logout', function(req, res) {
    delete req.session.user;
    res.redirect('login');
});

// Index
router.get('/',function(req, res, next) {
               res.render('index', { title: 'Express' });
           });

router.use('/user', require('./user'));
router.use('/character', require('./character'));


module.exports = router;
