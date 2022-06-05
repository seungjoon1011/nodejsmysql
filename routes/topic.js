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
var template2 = require('../template2.js');
const { disabled } = require('express/lib/application');
console.log('topic');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', '../views');


var loging = false;

router.get('/create', function(req,res){
    console.log('topiccreate');
    console.log('yes');
    loging = template.CheckLogin(req,res);
    if(loging){
       res.render('topic/create_topic',{title:'create', action:'/topic/create_process'});
    }else{
        res.redirect(404);
    }
});


router.get(`/:pageId`, function(req,res){
    console.log('topic.pageid');
    var cookies = {};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }
    var Id = req.params.pageId;
    if(cookies.count){
        var count = parseInt(cookies.count);
    }else{
        var count = 0;
    }
    count = count + 1;
    res.cookie('count', count,{path:`/topic/${Id}`});
    loging = template.CheckLogin(req,res);
    console.log('count'+count);
    db.query(`UPDATE topic SET views = ? WHERE id = ?;`,[count,Id],function(){});
    db.query(`SELECT topic.id, title, description, views, topic.time, update_time,user_id, name FROM topic LEFT JOIN user ON topic.user_id=user.id WHERE topic.id=?`,[Id],function(error2,topic){
        var title = topic[0].title;
            var description = topic[0].description;
            var com = parseInt(cookies.com);
            description=description.replaceAll('\n','<br>');
        if(loging){
            db.query(`SELECT * FROM user WHERE email=?`,[cookies.email],function(err,user){
                var name = user[0].name;
                if(com=1){
                    db.query(`SELECT * FROM comments WHERE topic_id=?`,[Id],function(err,comment){//error 발생 지점
                        console.log(comment);
                        db.query(`SELECT * FROM user WHERE email =?`,[cookies.email],function(err,user){
                            res.render('topic/view_pages', {loging: template.CheckLogin(req,res), Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: `${topic[0].user_id}`, user_id: `${user[0].id}`, time: `${template2.ConvertToDatefunction(topic[0].time)}`, author: `${topic[0].name}`, update_time:`${template2.ConvertToDatefunction(topic[0].update_time)}`, views:`${topic[0].views}`, comlist:template.comlist(comment,Id,name,template.CheckLogin(req,res)),com:1});
                        });  
                    });
                }else{
                    db.query(`SELECT * FROM user WHERE email =?`,[cookies.email],function(err,user){
                        res.render('topic/view_pages', {loging: template.CheckLogin(req,res), Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: `${topic[0].user_id}`, user_id: `${user[0].id}`, time: `${template2.ConvertToDatefunction(topic[0].time)}`, author: `${topic[0].name}`, update_time:`${template2.ConvertToDatefunction(topic[0].update_time)}`, views:`${topic[0].views}`, comlist:undefined, com:0});
                    });  
                }
            });
        }else{
            if(com=1){
                db.query(`SELECT * FROM comments WHERE topic_id=?`,[Id],function(err,comment){
                    res.render('topic/view_pages',{loging: template.CheckLogin(req,res), Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: undefined, user_id: undefined, time: `${template2.ConvertToDatefunction(topic[0].time)}`, author: `${topic[0].name}`, update_time:`${template2.ConvertToDatefunction(topic[0].update_time)}`, views:`${topic[0].views}`, comlist:template.comlist(comment,Id,undefined,template.CheckLogin(req,res)),com:1});
                });
            }else{
                res.render('topic/view_pages',{loging: template.CheckLogin(req,res), Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: undefined, user_id: undefined, time: `${template2.ConvertToDatefunction(topic[0].time)}`, author: `${topic[0].name}`, update_time:`${template2.ConvertToDatefunction(topic[0].update_time)}`, views:`${topic[0].views}`, comlist:undefined,com:0});
            }  
        }    
    }); 
})
router.post("/create_process", function(req,res){
    console.log('topiccreateprocess');
    var post = req.body;
    var cookies = {};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }
    var title = post.title.trim();
    var description = post.description.trim();
    if(title==''||description==''){
        res.send("<script>alert('fill the blank!');location.href='http://localhost:3000/create'</script>");
    }
    else{db.query(`SELECT * FROM user WHERE email=?`,[cookies.email],function(err,user){
            db.query(`INSERT INTO topic (title, description, user_id, time, views) VALUES(?, ?, ?, UNIX_TIMESTAMP(),0
            );`,
            [title, description, user[0].id],
            function(err, result){
                res.redirect(`/`);
            })
        })  
    }
});

router.get(`/update/:Id`, function(req,res){
    console.log('topicupdate');
    var Id = req.params.Id;
    db.query(`SELECT * FROM topic WHERE id = ?`,[Id], function(err, topic){
        res.render('topic/update_topic', {title: 'update', action: `/topic/update_process/${Id}`, topicTitle: `${topic[0].title}`,topicDescription: `${topic[0].description}`, Id: `${Id}`})
    })
})

router.post(`/update_process/:Id`, function(req, res){
    console.log('topicupdateprocess');
    var Id = req.params.Id;
    var post = req.body;
    var title = post.title.trim();
    var description = post.description.trim();
    if(title==''||description==''){
        res.send(`<script>alert('fill the blank!');location.href="http://localhost:3000/update/${Id}"</script>`);
    }else{
        db.query(`UPDATE topic SET title=?, description=?, update_time=UNIX_TIMESTAMP() WHERE id=?`,[title, description
            ,Id], function(err,result){
            res.redirect(`/topic/${Id}`);
        })
    }
})

router.post(`/delete_process`, function(req, res){
    console.log('topicdeleteprocess');
    var post = req.body;
    db.query(`DELETE FROM topic WHERE id = ?`,[post.id],function(err,result){
        console.log(req.body);
        res.redirect(`/`);
    })
})
router.post(`/search`, function(req,res){
    db.query(`SELECT topic.id, title, description, views, topic.time,update_time, name FROM topic LEFT JOIN user ON topic.user_id=user.id WHERE title LIKE '%${req.body.title}%'`,function(err,topic){
        console.log(1, req.body.title);
        console.log(topic);
        res.render('homepage',{loging: template.CheckLogin(req,res), numOfpage: template.pageList(topic), topics: `${topic}`, pg: '1', list: template.list(topic,1)});
    })
})

module.exports = router;