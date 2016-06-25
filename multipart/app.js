/**
 * Multipart example downloading all the files to disk using co-busboy.
 * If all you want is to download the files to a temporary folder,
 * just use https://github.com/cojs/multipart instead of copying this code
 * as it handles file descriptor limits whereas this does not.
 */


/*测试文件上传*/
var os = require('os');
var path = require('path');
var koa = require('koa');
var fs = require('co-fs');
var parse = require('co-busboy');
var saveTo = require('save-to');

var app = module.exports = koa();

app.use(function *(){
  // parse the multipart body
  var parts = parse(this, {
    autoFields: true // saves the fields to parts.field(s)
  });

  // create a temporary folder to store files
  var tmpdir = path.join(os.tmpdir(), uid());

  // make the temporary directory
  yield fs.mkdir(tmpdir); //co的fs  其回调函数应该是通过next() 将data返回给yield

  // list of all the files
  var files = [];
  var file;

  // yield each part as a stream
  var part;
  part = yield parts;
  while (part) {
    // filename for this part
    files.push(file = path.join(tmpdir, part.filename));
    // save the file
    var rs = yield saveTo(part, file);
    console.log(rs);
    part = yield parts;
  }

  // return all the filenames as an array
  // after all the files have finished downloading
  this.body = files;
});

if (!module.parent) app.listen(3000);

function uid() {
  return Math.random().toString(36).slice(2);
}
