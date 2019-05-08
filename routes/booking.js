const route = require('express').Router();
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
var flash = require('connect-flash');
var log = require('../routes/login');
var carnamer = require('../routes/car_selection');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
});

route.get('/booking',require('connect-ensure-login').ensureLoggedIn('/login'), function(req, res){
        var carn = carnamer.caramer();
        res.render('booking', {carn:carn});
});

route.post('/booking',function(req, res){
    var x = log.logger();
    var dat;
    var d = req.body.arrivaldate;
    var year = d.slice(8, 12);
    var month = d.slice(0, 3);
    var day = d.slice(4, 6);
    if(month == 'Jan'){
        dat = year + '-01-' + day; 
    }
    else if(month == 'Feb'){
        dat = year + '-02-' + day;
    }
    else if(month == 'Mar'){
        dat = year + '-03-' + day;
    }
    else if(month == 'Apr'){
        dat = year + '-04-' + day;
    }
    else if(month == 'May'){
        dat = year + '-05-' + day;
    }
    else if(month == 'Jun'){
        dat = year + '-06-' + day;
    }
    else if(month == 'Jul'){
        dat = year + '-07-' + day;
    }
    else if(month == 'Aug'){
        dat = year + '-08-' + day;
    }
    else if(month == 'Sep'){
        dat = year + '-09-' + day;
    }
    else if(month == 'Oct'){
        dat = year + '-10-' + day;
    }
    else if(month == 'Nov'){
        dat = year + '-11-' + day;
    }
    else if(month == 'Dec'){
        dat = year + '-12-' + day;
    }

    connection.query('SELECT * FROM available_cars WHERE name_of_cars =  ?',[req.body.car_name],function(err, results, fields){
        console.log(results);
        var car_price = results[0].price;
        var car_image_location = results[0].image_location;
        var users = {
        "Email": x,
        "image_location":car_image_location,
        "price": car_price,
        "Departure_Date":req.body.departuredate,
        "Arrival_Date": dat,
        "Time": req.body.time,
        "Car_Name": req.body.car_name,
        "Pick_Up_Location": req.body.location1,
        "Drop_off_Location": req.body.location2,
        "Name": req.body.name,
        "Phone_Number": req.body.phone,
        "Message": req.body.message,
        "Status": "Active"
        } 

            connection.query('INSERT INTO customers SET ?',[users], function (error, results, fields) {
                if (error) {
                    console.log("error ocurred",error);
                    res.send({
                    "code":400,
                    "failed":"error ocurred"
                    })
                }
             });
            });
             connection.query('DELETE FROM available_cars WHERE name_of_cars = ?',[req.body.car_name],function(error, results, fields){
                 if(error){
                console.log('error occured paths', error);
                res.send({
                "code":400,
                "failed":"error ocurred"
             })
            }
            })
            var m = "your booking is successful.Thanks for Booking Your car with us."
            const output = `
            <p>Your car has been booked</p>
            <h3>contact details</h3>
            <ul>
                <li>Car Name: ${req.body.car_name}</li>
                <li>Arrival Date: ${req.body.arrivaldate}</li>
                <li>Departure Date: ${req.body.departuredate}</li>
                <li>Time: ${req.body.time}</li>
                <li>Pick up location: ${req.body.location1}</li>
                <li>Drop off location: ${req.body.location2}</li>
            </ul>
            <p>${m}</p>
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
                from: '"BookMyCar" <sarangchoudhary1996@gmail.com>', // sender address
                to: x, // list of receivers
                subject: 'BookMyCar Booking', // Subject line
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
                res.redirect('/booking/confirmed');
            });
    })
module.exports = route