/*This file specifies the properties of the connection to the db
Returns a connection which can be used wherever called
Uses the mysql2 module*/
var mysql = require('mysql2');

var connection = mysql.createConnection({       //Details of the connection
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'trainiwp'
});

//Experimented with heroku ClearDB.
// var connection = mysql.createConnection('mysql://baabc10c17a25e:c94d6bce@us-cdbr-iron-east-02.cleardb.net/heroku_e46341c9bbd6fae?reconnect=true');

var db;
function connectDatabase() {                //The function to actually connect to the db. Logs whether it successfully connected or not.
    if (!db) {
        db = connection;

        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();         //Returns a connection which can be used anywhere when called.