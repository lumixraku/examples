var koa = require('koa');
var parse = require('co-body');
var session = require('koa-session');
var csrf = require('koa-csrf');
var route = require('koa-route');

var app = module.exports = koa();


var views = require('co-views');
var render = views(__dirname + '/views', {
  map: { html: 'swig' }
});

/**
 * csrf need session
 */

// 设置 Cookie 签名密钥。 //就是给cookie加密的钥匙?
app.keys = ['session key', 'csrf example'];
//签名密钥只在配置项 signed 参数为真是才会生效：
// this.cookies.set('name', 'tobi', { signed: true });



app.use(session(app));

/**
 * maybe a bodyparser
 */

app.use(function *(next) {
  if (this.is('application/json')) {
    this.request.body = yield parse(this);
  }
  yield* next;
});

/**
 * csrf middleware
 */

app.use(csrf());


/**
 * route
 */
var myToken;
app.use(route.get('/create', create));
app.use(route.get('/token', token));
app.use(route.post('/post', post));
// app.use(route.get('/get', get));

function* create(){
  console.log(myToken);
  this.body = yield render('post', {csrf: myToken});
}

function* token () {
  myToken = this.csrf;
  this.cookies.set('token', myToken);
  this.body = myToken;
}

function* get() {
  console.log(myToken);
  this.body = {ok: true};
}


//POST 失败
function* post() {
  console.log('post', myToken);
  this.body = {ok: true};
}

if (!module.parent) app.listen(3000);
