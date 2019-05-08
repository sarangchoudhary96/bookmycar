const route = require('express').Router();

route.get('/booking/confirmed',require('connect-ensure-login').ensureLoggedIn('/login'), function(req, res){
    res.render('final_booked');
});
module.exports = route