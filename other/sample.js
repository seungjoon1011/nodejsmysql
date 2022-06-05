var express = require('express');
var app = express();
app.get(`/`, function(req,res){
    var html = `
    <html>
    <head> 
        <title>test</title>
    </head>
    <body>
        <h1>test</h1>
        <p>
            <a href="/create_account">create_account</a>
            <a href="/login">login</a>
        </p>
    </body>
    </html>
    `;
    res.send(html);
});
app.get(`/create_account`, function(req,res){
    var html = `
    <html>
    <head> 
        <title>create_account</title>
    </head>
    <body>
        <h1>create_account</h1>
        <p>
            <form action="/create_account_process" method="post">
                <input type="text" name="email" placeholder="email">
                <input type="password" name="password" placeholder="password">
                <input type="text" name="name" placeholder="name">
            </form>
        </p>
    </body>
    </html>
    `;
    res.send(html);
})
app.get(`/login`, function(req,res){
    var html = `
    <html>
    <head> 
        <title>login</title>
    </head>
    <body>
        <h1>login</h1>
        <p>
            <form action="/login_process" method="post">
                <input type="text" name="email" placeholder="email">
                <input type="password" name="password" placeholder="password">
            </form>
        </p>
    </body>
    </html>
    `;
    res.send(html);
})
app.listen(3000, function(){
    console.log(`in execution`);
});