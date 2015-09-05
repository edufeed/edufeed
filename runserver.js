(function(){
  var fs, async, os, path, is_windows, ref$, exec, which, is_couchdb_running, does_user_exist, couchdb_server, i$, len$, command, couchserver_started, once_couchdb_running;
  fs = require('fs');
  async = require('async');
  os = require('os');
  path = require('path');
  is_windows = os.platform() === 'win32';
  ref$ = require('shelljs'), exec = ref$.exec, which = ref$.which;
  ref$ = require('./couchdb_utils'), is_couchdb_running = ref$.is_couchdb_running, does_user_exist = ref$.does_user_exist, couchdb_server = ref$.couchdb_server;
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
  for (i$ = 0, len$ = (ref$ = ['gulp', 'node-dev']).length; i$ < len$; ++i$) {
    command = ref$[i$];
    if (!which(command)) {
      console.log("missing " + command + " command");
      process.exit();
    }
  }
  (function(){
    var couchdb_dir;
    if (is_windows) {
      couchdb_dir = 'C:/Program Files/Apache Software Foundation/CouchDB/bin/'.split('/').join(path.sep);
      if (fs.existsSync(couchdb_dir)) {
        process.env.PATH += ';' + couchdb_dir;
        return;
      }
      couchdb_dir = 'C:/Program Files (x86)/Apache Software Foundation/CouchDB/bin/'.split('/').join(path.sep);
      if (fs.existsSync(couchdb_dir)) {
        process.env.PATH += ';' + couchdb_dir;
      }
    }
  })();
  exec('gulp', {
    async: true
  });
  couchserver_started = function(){
    exec('node scripts/create_users');
    return exec('node-dev app.ls', {
      async: true
    });
  };
  once_couchdb_running = function(callback){
    return is_couchdb_running(function(running){
      if (running) {
        return callback();
      } else {
        console.log('waiting for couchdb to start running');
        return setTimeout(function(){
          return once_couchdb_running(callback);
        }, 1000);
      }
    });
  };
  is_couchdb_running(function(running){
    if (running) {
      console.log('using already-running couchdb instance at ' + couchdb_server);
      couchserver_started();
      return;
    }
    if (!which('couchdb')) {
      console.log('couchdb command not found');
      return;
    }
    exec('couchdb', {
      async: true
    });
    return once_couchdb_running(function(){
      console.log('=====================================================');
      exec('node scripts/getip');
      console.log('=====================================================');
      return couchserver_started();
    });
  });
}).call(this);
