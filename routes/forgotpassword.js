const route = require('express').Router();
var flash = require('connect-flash');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
});

route.get('/forgotpassword', function(req, res){
    res.render('forgotpassword');
})

route.post('/forgotpassword', function(req, res){
    var token = '';
    crypto.randomBytes(20, (err, buf) => {
        if(err) throw err;
        token += buf.toString('hex');
    });
    var email = req.body.email;
    module.exports.sender = function () { 
        return email;
    };
    connection.query('SELECT * FROM users WHERE Email = ?', [email], function(error, result, fields){
        if(result.length > 0){
            if(result[0].Email == email){
            result[0].resetpasswordtoken = token;
            result[0].resetpasswordexpires = Date.now() + 3600000;
            module.exports.sender1 = function(){
                return result;
            };

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'sarangchoudhary1996@gmail.com', // generated ethereal user
                    pass: 'sarang@54321' // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"BookMyTrip" <sarangchoudhary1996@gmail.com>', // sender address
                to: email, // list of receivers
                subject: 'Bookmytrip reset password link', // Subject line
                text: 'you are receiving this mail http://' + req.headers.host + '/reset/', // plain text body
                html: 'you are receiving this mail because you have requested the reset of your password. please click on the following link or just copy this link to your browser to reset your password http://' + req.headers.host + '/reset/' + token + ' If you did not request this, please ignore this email and password will remain unchanged <br><br><br><strong>Note :</strong> This link is valid only for one hour.' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                //res.render('index', {msg: 'Email has been sent'});
            });
                req.flash('success_msg', 'A reset password link has been sent to your email');
                res.redirect('/forgotpassword');
            }
        }
        else{
            req.flash('error','Email does not exist');
            res.redirect('/forgotpassword');
        }
    })
  })
module.exports = route