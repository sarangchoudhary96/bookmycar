const route = require('express').Router();
const mysql = require('mysql2');
var loge = require('./login');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
});

route.get('/mybookings',require('connect-ensure-login').ensureLoggedIn('/login'), function(req, res){
    
    res.render('mybookings');
});

route.get('/car/booking/:id', function(req, res, next){
    var id = req.params.id;
    connection.query('SELECT * FROM customers WHERE Status = ?', id, function(err, rows, fields){
        if(err) throw err;
        res.send(rows);
    });
});
module.exports = route