(function(){
  var fs, yamlfile, async, ref$, is_couchdb_running, does_user_exist, signup_user, couchdb_server, classes_file, create_user, create_users, main;
  fs = require('fs');
  yamlfile = require('yamlfile');
  async = require('async');
  ref$ = require('../couchdb_utils'), is_couchdb_running = ref$.is_couchdb_running, does_user_exist = ref$.does_user_exist, signup_user = ref$.signup_user, couchdb_server = ref$.couchdb_server;
  classes_file = 'www/classes.yaml';
  create_user = function(username, callback){
    return does_user_exist(username, function(user_exists){
      if (user_exists) {
        console.log(username + ' already exists.');
        callback(null, null);
        return;
      }
      console.log('create_user ' + username);
      return signup_user(username, username, function(){
        return callback(null, null);
      });
    });
  };
  create_users = function(){
    var classes, users, classname, classinfo;
    console.log('creating users');
    classes = yamlfile.readFileSync(classes_file);
    users = (function(){
      var ref$, results$ = [];
      for (classname in ref$ = classes) {
        classinfo = ref$[classname];
        results$.push(classinfo.users);
      }
      return results$;
    }()).reduce(curry$(function(x$, y$){
      return x$.concat(y$);
    }));
    console.log(users);
    return async.eachSeries(users, create_user);
  };
  main = function(){
    if (!fs.existsSync(classes_file)) {
      console.log('you need to run this script from the edufeed directory');
      return;
    }
    return is_couchdb_running(function(isrunning){
      if (!isrunning) {
        console.log('couchdb not running');
      } else {
        return create_users();
      }
    });
  };
  main();
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
