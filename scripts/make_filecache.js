(function(){
  var glob, fs, files, output, i$, len$, file;
  glob = require('glob');
  fs = require('fs');
  process.chdir('www');
  files = glob.sync('**/*.mp3');
  output = {};
  for (i$ = 0, len$ = files.length; i$ < len$; ++i$) {
    file = files[i$];
    output[file] = 'data:audio/mpeg;base64,' + new Buffer(fs.readFileSync(file)).toString('base64');
  }
  fs.writeFileSync('filecache.js', 'filecache = ' + JSON.stringify(output, null, 2));
}).call(this);
