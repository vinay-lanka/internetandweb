const express = require('express')
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

const app = express()
const port = 3000
app.use(cookieParser());
app.use(express.static(__dirname + '/public/'));    
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());                            
app.use(session({        
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', (req,res)=>{
    if(req.session.loggedin){
        res.redirect('/dashboard');
    }else{
        res.redirect('/login');
    }
});

app.get('/logout', (req,res)=>{                         //Logout route. Clears cookies and resets session variables and redirects to '/'
    req.session.loggedin = false;
    res.clearCookie('userdata');
    res.redirect('/');
    console.log("called");

    // var promise = new Promise((resolve,reject)=>{
    //     req.session.loggedin = false;
    //     res.clearCookie('userdata');
    // });
    // promise.then((result)=>{
    //     console.log("called");
    //     res.redirect('/');
    // });
});

app.use('/login', require('./Routes/login'));
app.use('/dashboard', require('./Routes/dashboard'));
app.use('/userdetails', require('./Routes/userdetails'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));