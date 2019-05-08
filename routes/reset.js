const route = require('express').Router();
var flash = require('connect-flash');
const mysql = require('mysql2');
const sen = require('../routes/forgotpassword');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
});

route.get('/reset/:id', function(req, res){
     const u = sen.sender1(); 
     const date_now = Date.now();
     if(date_now > u[0].resetpasswordexpires){
         req.flash('error','This link has been expired now');
         res.redirect('/login');
     }
     else{
        res.render('reset', {token: req.params.id});
     }
});

route.post('/reset', function(req, res){
    var e = sen.sender();
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    if(password1 != password2){
        req.flash('error', 'passwords do not match')
        res.redirect('/reset');
    }
    bcrypt.hash(password1, 10, function(err, hash){
        if(err) throw err;
        connection.query("UPDATE users SET password = ? WHERE Email = ?",[hash, e[0].Email], function(err){
            if(err) throw err;
        });
        req.flash('success_msg', 'Your password has been updated successfully');
        res.redirect('/login');
    })
})
module.exports = route