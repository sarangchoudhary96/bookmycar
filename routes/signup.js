const route = require('express').Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

route.get('/signup/:id', function(req, res){
    crypto.randomBytes(80, (err, buff) => {
        var tok  = buff.toString('hex');
        res.render('signup', {tok : tok});
    });
})

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
});

route.post('/signup', function(req, res){
    var name = req.body.Name;
    var email = req.body.email;
    var password = req.body.password;
    var password1 = req.body.password1;

    req.checkBody('password1', 'passwords do not match').equals(req.body.password);
    req.checkBody('email', 'Enter a valid email address').isEmail();
    req.checkBody('password','Password length should be atleast 8 characters').isLength({min: 8, max: undefined});

    var errors = req.validationErrors();
    if(errors){
        res.render('signup',{
            errors: errors
        })
    }
    else{
        connection.query('SELECT * FROM users WHERE Email = ?',[email], function (error, results, fields) {
            if (error) {
              res.send({
                "code":400,
                "failed":"error ocurred from database"
              })
            }
            else{
              if(results.length >0){
                  req.flash('error_msg','Email already exists');
                  res.redirect('/signup');
              }
              else{
                bcrypt.hash(req.body.password, 10, function(err, hash){
                var users={
                    "Name":req.body.Name,
                    "Email":req.body.email,
                    "password":hash,
                }
                connection.query('INSERT INTO users SET ?',users, function (error, results, fields) {
                if (error) {
                    console.log("error ocurred",error);
                    res.send({
                    "code":400,
                    "failed":"error ocurred"
                    })
                }
                else{
                   // console.log('The solution is: ', results);
                    req.flash('success_msg','You have sucessfully signed up');
                    res.redirect('/login');
                }
             });
            })
            }
        }
    });
    }
})
module.exports = route