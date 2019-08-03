module.exports = {

    check_login: function(req, res){
        if(!req.session.user){
            // res.sendStatus(403);
            res.redirect('/login');
            return false
        }
        return true
    }
}
