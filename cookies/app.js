/**
 * This example simply sets the number of views from the same client
 * both as a cookie and as a response string.
 */

var koa = require('koa');
var app = module.exports = koa();

app.use(function *(){
  var n = ~~this.cookies.get('view') + 1;
  // 服务器通过Set-Cookie响应头字段来指示浏览器保存Cookie
  // 这个设置的值无法使用js访问到 //服务端设置的cookie js是读取不到的
  this.cookies.set('view', n); //操作客户端的cookies
  this.body = n + ' views';
});

if (!module.parent) app.listen(3000);
