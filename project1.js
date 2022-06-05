var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', './views');

const topic = require('./routes/topic');
const user = require('./routes/user');
const global = require('./routes/global');
const comments = require('./routes/comments');
const text = require('body-parser/lib/types/text');
const template2 = require('./template2');
app.use('/', global);
app.use('/topic', topic);
app.use('/user', user);
app.use('/comments', comments);
app.listen(3000, function(){
console.log(`on going!`);
});