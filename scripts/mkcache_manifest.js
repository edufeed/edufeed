(function(){
  var fs, path, child_process, file, pubdir, outfile, fd, log, filelist, patterns, i$, len$, filename, fn1$ = curry$(function(x$, y$){
    return x$ || y$;
  });
  fs = require('fs');
  path = require('path');
  child_process = require('child_process');
  file = require('file');
  pubdir = path.join(__dirname, '..', 'public');
  outfile = path.join(pubdir, 'cache.appcache');
  fd = fs.openSync(outfile, 'w');
  log = function(line){
    return fs.writeSync(fd, line + '\n');
  };
  filelist = [];
  file.walkSync(pubdir, function(dirpath, dirs, files){
    var i$, len$, filename, results$ = [];
    for (i$ = 0, len$ = files.length; i$ < len$; ++i$) {
      filename = files[i$];
      results$.push(filelist.push('/' + file.path.relativePath(pubdir, path.join(dirpath, filename)).split('\\').join('/')));
    }
    return results$;
  });
  log('CACHE MANIFEST');
  log('# random value: ' + Math.random());
  log('');
  log('CACHE:');
  patterns = ['.html$', '.js$', '.css$', '.png$', '.svg$', '.mp3$', '.woff2$', '.woff$', '.ttf$'].map(function(x){
    return new RegExp(x);
  });
  for (i$ = 0, len$ = filelist.length; i$ < len$; ++i$) {
    filename = filelist[i$];
    if (patterns.map(fn$).reduce(fn1$, false)) {
      log(filename);
    }
  }
  log('');
  log('NETWORK:');
  log('/image');
  log('/proxy');
  function fn$(x){
    return x.test(filename);
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
