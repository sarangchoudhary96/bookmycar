const route = require('express').Router();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
});

route.get('/', function(req, res){   
    var datetime = new Date();
    var date_today = datetime.toISOString().slice(0,10);

    connection.query("SELECT * FROM customers WHERE Arrival_Date = ? && Status = 'Active'",date_today, function(err, results, fields){
        if(results.length > 0){
            for(var i = 0; i < results.length; i++){
                car = {
                    name_of_cars: results[i].Car_Name,
                    price: results[i].price,
                    image_location: results[i].image_location
                }
                connection.query('INSERT INTO available_cars SET ?', car , function(err){
                    if(err) throw err;
                })
            }
            connection.query("UPDATE customers SET Status = 'Completed' WHERE Arrival_Date = ?",date_today, function(err){
                if(err) throw err;
            })
        }
    });
    crypto.randomBytes(20, (err, buff) => {
        if(err) throw err;
        var tok = buff.toString('hex');
        res.render('index',{tok: tok});
    });
});

//Nodemailer(Contact)
route.post('/send', (req, res) => {
    
    const output = `
        <p>you have a new contact request</p>
        <h3>contact details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

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
        from: '"Bookmytrip contact" <sarangchoudhary1996@gmail.com>', // sender address
        to: 'sarangchoudhary@yahoo.com', // list of receivers
        subject: 'Bookmytrip request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        //res.render('index', {msg: 'Email has been sent'});
        res.redirect('/');
    });
})
module.exports = route