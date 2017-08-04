const express = require('express');
const app = express();
const server = require('http').Server(app);
var port = '3001'
var ejs = require('ejs');
var path=require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');





var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var dbUrl='mongodb://localhost/blog';
//链接数据库
mongoose.connect(dbUrl);
mongoose.connection.on('connected', function () {
  console.log('>>>>> MongoDateBase connection success!')
});
app.use(cookieParser())
app.use(session({
  secret:'heheheh',
  resave:false,
  saveUninitialized:true,
  store:new mongoStore({
    url:dbUrl,
    collection:'sessions'
  })
}))



app.set('views', path.join(__dirname,'../public/views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


console.log(path.join(__dirname,'../public'));
app.use(express.static(path.join(__dirname,'../public')));






//表单数据格式化
//必须按照下面这样写！
// bodyParser.parse('multipart/form-data') = function(req, options, next) {
//   // parse request body your way; example of such action:
//   // https://github.com/senchalabs/connect/blob/master/lib/middleware/multipart.js
//
//   // for your needs it will probably be this:
//   next();
// }
// console.log(bodyParser);
app.use(bodyParser.json());
// app.use(bodyParser.multipart());
app.use(bodyParser.urlencoded({extended: true}));



server.listen(port);
console.log('跑起来了,在端口'+port);
require('./routes')(app)
