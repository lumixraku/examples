var koa = require('koa');
var auth = require('koa-basic-auth');
var app = module.exports = koa();

// custom 401 handling

app.use(function*(next) {
    try { yield * next;
    } catch (err) {
        if (401 == err.status) {
            this.status = 401;
            this.body = 'cant haz that';
        } else {
            throw err;
        }
    }
});

// require auth
// 当发出的 Basic Auth 请求符合 下面的规则 就不会抛出异常
// 这种类型的请求在Postman中可以设置
app.use(auth({ name: 'haha', pass: 'tobi' }));
// app.use(auth({ name: 'tj', pass: 'tobi' }));
// app.use(function*(next) {
//     console.log('(2)');
//     return auth({
//         name: 'jjajaj',
//         pass: 'heheheh'
//     });
// });

// secret response

app.use(function*() {
    this.body = 'secret';
});

if (!module.parent) app.listen(3000);
