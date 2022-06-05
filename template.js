var cookie = require('cookie');
var template2 = require('./template2');

module.exports={
    list:function(topics, pg){
        var list = [];
        if(topics.length%20 == 0){
            numOfpage = topics.length/20;
        }else {
            numOfpage = Math.ceil(topics.length/20);
        }
        console.log('numofpage:',numOfpage);
        if(topics[0].update_time){
            console.log(1);
        }
        var keyNum = numOfpage - pg;
        console.log('topic'+topics.length);
        if(pg==numOfpage){
            for(let i = (topics.length-20*(numOfpage-1))-1;i>=0;i--){
                list[i] = `<td><a href="/topic/${topics[i].id}">${topics[i].id}</td><td><a href="/topic/${topics[i].id}">${topics[i].title}</a></td><td>${topics[i].name}</td><td>${template2.CheckDate(topics[i].time)}</td><td>${topics[i].views}</td>`
            }
        }else{
            for(let i = (20*(keyNum)+topics.length%20)-1;i>=topics.length%20+20*(keyNum-1);i--){//
                list[i] = `<td><a href="/topic/${topics[i].id}">${topics[i].id}</td><td><a href="/topic/${topics[i].id}">${topics[i].title}</a></td><td>${topics[i].name}</td><td>${template2.CheckDate(topics[i].time)}</td><td>${topics[i].views}</td>`
            }
        }
        console.log(list.length);
        return list;
    },comlist:function(comment,id,name,loging){
        var comlist=[];
        for(let i = 0;i<comment.length;i++){
            comlist[i] =`<td>${comment[i].Commentid}</td><td>${comment[i].user_id}</td><td>${comment[i].comment}</td><td>${template2.CheckTime(comment[i].time)}</td>`;
            console.log(name, comment[i].user_id);
            if(name==comment[i].user_id){
                comlist[i]+=`<td>
                <form action ="/comments/delete_process" method="post">
                <input type="hidden" name="comId" value="${comment[i].Commentid}">
                <input type="hidden" name="Id" value="${id}">
                <input type="submit" value="delete">
                </form> </a></td>
                `;
            }
        }
        return comlist;
    },pageList:function(topics){
        var numOfpage = 0;
        if(topics.length%20 == 0){
            numOfpage = topics.length/20;
        }else {
            numOfpage = Math.ceil(topics.length/20);
        }
        var pageList = ``;
        for(let i = 1;i<numOfpage+1;i++){
            pageList = pageList +`<a href="/global/${i}"> ${i}</a>`
        }
        return parseInt(numOfpage);
    },CheckLogin:function(req, res){
        var loging = false;
        var cookies = {};
        if(req.headers.cookie){
            cookies = cookie.parse(req.headers.cookie);
        }
        if(cookies.email ==undefined){
            loging = false;
        }else{
            loging = true;
        }
        return loging;
    }
}