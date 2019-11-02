var express = require('express');
var crypto = require('crypto');
var connection = require('../connection');
var router = express.Router();

var secret = 'asecretkey';      //Secret key for encrypting password. Should not be changed once started and should be the same as decrypting secret

function encrypt(text) {        //Encrpyition function. Uses aes128 standard via the crypto module
    encryptalgo = crypto.createCipher('aes128', secret);
    let encrypted = encryptalgo.update(text, 'utf8', 'hex');
    encrypted += encryptalgo.final('hex');
    return encrypted;
}
function decrypt(encrypted) {       //Function for decryption of passwords. Uses the aes128 standard with the crypto package
    decryptalgo = crypto.createDecipher('aes128', secret);
    let decrypted = decryptalgo.update(encrypted, 'hex', 'utf8');
    decrypted += decryptalgo.final('utf8');
    return decrypted;
}

router.get('/', (req,res)=>{       
    if(req.session.loggedin){
        res.redirect('/dashboard')
    }else{
        res.sendFile('/public/pages/login.html', {'root': './'});   //Login page
    }
});

router.post('/signin',(req,res)=>{
    // console.log(req.body);
    // res.sendFile('/public/pages/index.html', {'root': './'}); 
    const {email, password} = req.body;
    if (email && password) {
        var promise = new Promise((resolve,reject)=>{
            connection.query('SELECT * FROM users WHERE email = ?', [email],(err,res)=>{      //Checking for corresponding encrypted password in db
                if (err){
                    console.log(err);
                    reject(err);                                //Error checking db
                }else{
                    // console.log(res);
                    // console.log(Object.keys(res).length);
                    if(Object.keys(res).length==0){
                        resolve('404');                         //This error pops up when there was no password to match 404 user not found case
                    }else{
                        Object.keys(res).forEach(function(key) {
                            var row = res[key];
                            resolve(row);                       //Encrypted password found and resolved for corresponding username
                        });
                    }
                }
            });
        });
        promise.then((result)=>{
            console.log(result);
            var encryptedpassword = result.pass;
            console.log(encryptedpassword);
            if(result!='404'){                       //Provided user exists
                // console.log("Encrypted - " + encryptedpassword);
                decryptedpass = decrypt(encryptedpassword);     //Decrypt the encrypted password from db
                if(decryptedpass == password){                  //Compare the passwords
                    req.session.loggedin = true;
                    req.session.email = email;
                    // res.session.data = result;
                    res.cookie('userdata', result);                        
                    res.redirect('/dashboard');                        
                }else{
                    res.send({message:'Wrong username or password'});   //Passwords did not match
                }
            }else{
                res.send({message:'Wrong username or password'});       //404 user not found
            }
        }, (err)=>{
            console.log(err);
            res.send({message:err.sqlMessage});             //Only happens with error in db so send sqlmessage
        });
	} else {
        res.send({message:'Please enter both email and password'});
    }
});

router.post('/signup', (req,res)=>{
    console.log(req.body);
    var values = [];
    var data = req.body;
    var encrypted = encrypt(data.password);
    values.push([data.fullname, data.email, encrypted, data.gender, data.dob]);
    if(req.body.password){
        connection.query('INSERT INTO users (fullname, emailid, pass, gender, dob) VALUES ?',[values], (err,response)=>{
            if (err){
                // console.log(err.sqlMessage);
                res.send(err.sqlMessage);
            }else{
                req.session.loggedin = true;
                // res.session.data = data;
                req.session.email = data.email;
                res.cookie('userdata', data);
                res.redirect('/dashboard');
            }
        });
    }else{
        res.send('Could not add user');
    }
});

module.exports = router;
