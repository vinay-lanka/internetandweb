var express = require('express');
var router = express.Router();

router.get('/', (req,res)=>{      
        if(req.session.loggedin){
        res.sendFile('/public/pages/index.html', {'root': './'}); 
        }else{
        res.redirect('/login');
        }
});

module.exports = router;