const router = require('express').Router();
var db = require('../db.js');
var template = require(`../template.js`);
var fs = require('fs');
var http = require('http');
var qs = require('querystring');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var cookie = require('cookie');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', '../views');

router.post('/create_process',function(req,res){
    var cookies = {};
    var name = '';
    res.cookie('com', 1,{path:`/topic/${req.body.id}`});
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }    
    db.query(`SELECT * FROM user WHERE email=?`,[cookies.email],function(err,user){
        name = user[0].name
        console.log(name);
        console.log('haha1');
        console.log('haha2');
        db.query(`INSERT INTO comments (topic_id, user_id, comment, time) VALUES(?,?,?, unix_timestamp(curtime()))`,[req.body.id,   name, req.body.comments],function(){});
    })
    res.redirect(`/topic/${req.body.id}`);
    })
router.post(`/delete_process`,function(req,res){
    console.log(req.body.Id,req.body.comId,'1234');
    db.query(`DELETE FROM comments WHERE Commentid = ?`,[req.body.comId]),function(){
//안에서 redirect하면 안됨...
    }
    res.redirect(`/topic/${req.body.Id}`);
})
module.exports = router;