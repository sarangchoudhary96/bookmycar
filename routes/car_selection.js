const route = require('express').Router();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
  });

route.get('/car_selection',require('connect-ensure-login').ensureLoggedIn('/login'), function(req, res){
    connection.query('SELECT * FROM available_cars', function(err, rows, cols){
        if(err) throw err;
        res.render("car_selection", {rows:rows});
    })
});

route.post('/car_selection', function(req, res){
    var car_name = req.body.carname;
    module.exports.caramer = function () { 
        return car_name;
    };
    res.redirect('/booking');
})
module.exports = route