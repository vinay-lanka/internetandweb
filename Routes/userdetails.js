var express = require('express');
var router = express.Router();
var connection = require('../connection');

router.get('/', (req,res)=>{      
    var userdetails = fetchuserdetails(req.session.email);       //Function to fetch user data
    userdetails.then((details)=>{
        if(details!='404'){
            jsondata = JSON.stringify(details)
            res.cookie('userdata', jsondata);       //userdata contains user details
            res.send(JSON.parse(jsondata));
        }else{
            res.send("Could not fetch");        //Send could not fetch
        }
    }, (err)=>{
        console.log(err);
    });
});

var fetchuserdetails = function(emailid) {     //Fetch user details function which returns a promise of userdetails.
    var promise = new Promise((resolve,reject)=>{
        connection.query('SELECT * FROM users WHERE emailid = ?', [emailid],(err,res)=>{
            if (err){
                console.log(err);
                reject(err);
            }else{
                // console.log(res);
                // console.log(Object.keys(res).length);
                if(Object.keys(res).length==0){
                    resolve('404');
                }else{
                    Object.keys(res).forEach(function(key) {
                        var row = res[key];
                        resolve(row);
                    });
                }
            }
        });
    });
    return promise;
}

module.exports = router;