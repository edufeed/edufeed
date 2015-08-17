(function(){
  var fs, ref$, exec, which, i$, len$, command;
  fs = require('fs');
  ref$ = require('shelljs'), exec = ref$.exec, which = ref$.which;
  if (!fs.existsSync('config.json')) {
    fs.writeFileSync('config.json', JSON.stringify({
      couchdb: {
        database_dir: 'couchdata'
      },
      log: {
        file: 'couchdb_log.txt'
      }
    }));
  }
  for (i$ = 0, len$ = (ref$ = ['pouchdb-server', 'gulp', 'node-dev']).length; i$ < len$; ++i$) {
    command = ref$[i$];
    if (!which(command)) {
      console.log("missing " + command + " command");
      process.exit();
    }
  }
  exec('pouchdb-server', {
    async: true
  });
  exec('gulp', {
    async: true
  });
  exec('node-dev app.ls', {
    async: true
  });
}).call(this);
