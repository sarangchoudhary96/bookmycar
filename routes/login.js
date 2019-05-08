const route = require('express').Router();
var flash = require('connect-flash');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../db');
var crypto = require('crypto');


route.get('/login/:id',function(req, res){
    crypto.randomBytes(20, (err, buff) => {
      if(err) throw err;
      var tok = buff.toString('hex');
      res.render('login',{tok: tok});
  });    
});

passport.use(new Strategy(function(username, password, cb) {
    db.findByUsername(username, function(err, user) {
      if (err){ 
        return cb(err); 
      }
      if (!user){
         return cb(null, false);
      }
      module.exports.logger = function () { 
        return username;
      };
      db.comparePassword(password, user[0].password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){          
          return cb(null, user);
        }
        else{
          return cb(null, false);
        }
      });
    });
}));
  
  passport.serializeUser(function(user, cb) {
    cb(null, user[0].Name);
  });
  
  passport.deserializeUser(function(user, cb) {
      cb(null, user);
  });

  route.post('/login',passport.authenticate('local', { failureRedirect: '/login',  failureFlash: 'Invalid username and Password'}), function(req, res){
    const id = req.body.username;
      res.redirect('/');
  });

route.get('/logout',function(req, res){
    req.logout();
    res.redirect('/');
});
module.exports = route