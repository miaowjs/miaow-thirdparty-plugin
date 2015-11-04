var minimatch = require('minimatch');

function Thirdparty(options) {
  this.options = options || {test: '*', tasks: []};

  var toString = Object.prototype.toString;
  this.options.tasks = this.options.tasks.map(function(task) {
    if (toString.call(task) === '[object Function]') {
      task = {
        task: task,
        options: {}
      };
    }

    return task;
  });
}

Thirdparty.prototype.apply = function(compiler) {
  var thirdparty = this;

  compiler.plugin('compile', function(compilation, callback) {
    compilation.plugin('build-module', thirdparty.check.bind(thirdparty));

    callback();
  });
};

Thirdparty.prototype.check = function(module, taskContext, callback) {
  var options = this.options;

  if (module.cached || !minimatch(module.src, options.test, {matchBase: true, dot: true})) {
    return callback();
  }

  // 如果是第三方代码，就重置任务
  if (/\/\*[\s\S]*?@thirdparty[\s\S]*?\*\//.test(module.contents.toString())) {
    module.tasks = options.tasks.concat(module.tasks.slice(-1));
    taskContext.extra.isThirdparty = true;
  }

  callback();
};

module.exports = Thirdparty;
