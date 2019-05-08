const mysql = require('mysql2');
var flash = require('connect-flash');
const bcrypt = require('bcrypt');


const connection = mysql.createConnection({
    host: 'localhost',
    database: 'bookmycar',
    user: 'root',
    password: 'PASSWORD'
});

exports.findByUsername = function(username, cb) {
    connection.query('SELECT * FROM users WHERE Email = ?',[username], function (error, results, fields) {
        if (error) {
          res.send({
            "code":400,
            "failed":"error ocurred from database"
          })
        }
        else{
          if(results.length >0){
            return cb(null, results);
          }
          else{
            return cb(null, null);
          }
        }
   });
}
exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err){
      console.log('err is' + err);
    }
    callback(null, isMatch);
  })
}