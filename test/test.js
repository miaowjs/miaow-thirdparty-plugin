var assert = require('assert');
var find = require('lodash.find');
var fs = require('fs');
var miaow = require('miaow');
var path = require('path');

var Plugin = require('../index');
describe('miaow-thirdparty-plugin', function() {
  this.timeout(10e3);

  var log;

  before(function(done) {
    miaow({
      context: path.resolve(__dirname, './fixtures')
    }, function(err) {
      if (err) {
        console.error(err.toString(), err.stack);
        process.exit(1);
      }

      log = JSON.parse(fs.readFileSync(path.resolve(__dirname, './output/miaow.log.json')));
      done();
    });
  });

  it('接口是否存在', function() {
    assert(!!Plugin);
  });

  it('正常文件', function() {
    assert.equal(find(log.modules, {src: 'normal.js'}).extra.isThirdparty, undefined);
  });

  it('第三方文件', function() {
    assert.equal(find(log.modules, {src: 'thirdparty.js'}).extra.isThirdparty, true);
  });
});
