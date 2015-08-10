(function(){
  var test_if_can_login, get_couchdb_login, db_cache, remote_db_cache, db_sync_handlers, getDb, setSyncHandler, getItems, clearDb, padWithZeros, prevUUID, makeUUID, postItem, out$ = typeof exports != 'undefined' && exports || this;
  out$.test_if_can_login = test_if_can_login = function(username, password, callback){
    return getCouchURL(function(couchurl){
      var pouchOpts, db, ajaxOpts;
      pouchOpts = {
        skipSetup: true
      };
      db = new PouchDB("https://" + couchurl + "/logs_" + username, pouchOpts);
      ajaxOpts = {
        headers: {
          Authorization: 'Basic ' + window.btoa(username + ':' + password)
        }
      };
      return db.login(username, password, ajaxOpts, function(err, response){
        if (err) {
          console.log(err);
          return callback(false);
        } else {
          return callback(true);
        }
      });
    });
  };
  out$.get_couchdb_login = get_couchdb_login = function(callback){
    return getUsername(function(username){
      return getPassword(function(password){
        return getCouchURL(function(couchurl){
          return callback({
            username: username,
            password: password,
            couchurl: couchurl
          });
        });
      });
    });
  };
  db_cache = {};
  remote_db_cache = {};
  db_sync_handlers = {};
  out$.getDb = getDb = function(dbname, options){
    var db, changes, params, sync, replicatetoremote;
    if (typeof dbname !== typeof '') {
      return dbname;
    }
    if (options == null) {
      options = {};
    }
    if (db_cache[dbname] != null) {
      return db_cache[dbname];
    }
    db = db_cache[dbname] = new PouchDB(dbname);
    changes = db.changes({
      live: true
    });
    changes.on('change', function(change){
      if (db_sync_handlers[dbname] != null) {
        return db_sync_handlers[dbname](change);
      }
    });
    params = getUrlParameters();
    sync = options.sync != null || params.sync != null;
    replicatetoremote = options.replicatetoremote != null || params.replicatetoremote != null;
    if (sync || replicatetoremote) {
      get_couchdb_login(function(couchdb_login){
        var username, password, couchurl, remote_db_url_string, remote_db;
        username = couchdb_login.username, password = couchdb_login.password, couchurl = couchdb_login.couchurl;
        remote_db_url_string = ("https://" + username + ":" + password + "@" + couchurl + "/") + dbname;
        console.log(remote_db_url_string);
        remote_db = remote_db_cache[dbname] = new PouchDB(remote_db_url_string);
        if (sync) {
          return db.sync(remote_db, {
            live: true
          }).on('error', function(err){
            console.log('sync error');
            return console.log(err);
          });
        } else if (replicatetoremote) {
          return db.replicate.to(remote_db, {
            live: true
          }).on('error', function(err){
            console.log('replicatetoremote error');
            return console.log(err);
          });
        }
      });
    }
    return db;
  };
  out$.setSyncHandler = setSyncHandler = function(dbname, callback){
    return db_sync_handlers[dbname] = callback;
  };
  out$.getItems = getItems = function(dbname, callback){
    var db;
    db = getDb(dbname);
    return db.allDocs({
      include_docs: true
    }).then(function(data){
      var x;
      return callback((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = data.rows).length; i$ < len$; ++i$) {
          x = ref$[i$];
          results$.push(x.doc);
        }
        return results$;
      }()));
    });
  };
  out$.clearDb = clearDb = function(dbname, callback){
    var db;
    db = getDb(dbname);
    return db.allDocs({
      include_docs: true
    }).then(function(data){
      return async.each(data.rows, function(x, callback){
        x.doc._deleted = true;
        return db.put(x.doc, callback);
      }, function(results){
        if (callback != null) {
          return callback(null, results);
        }
      });
    });
  };
  padWithZeros = function(num, target_length){
    var current, zeros_to_add;
    current = num.toString();
    zeros_to_add = target_length - current.length;
    return repeatString$('0', zeros_to_add) + current;
  };
  prevUUID = {
    time: 0,
    idx: 0
  };
  out$.makeUUID = makeUUID = function(){
    var curtime;
    curtime = Date.now();
    if (curtime === prevUUID.time) {
      prevUUID.idx += 1;
    } else {
      prevUUID.time = curtime;
      prevUUID.idx = 0;
    }
    return padWithZeros(prevUUID.time, 13).concat(padWithZeros(prevUUID.idx, 7));
  };
  out$.postItem = postItem = function(dbname, item, callback){
    var db, new_item;
    db = getDb(dbname);
    new_item = import$({}, item);
    if (new_item._id == null) {
      new_item._id = makeUUID();
    }
    return db.put(new_item, function(err, res){
      if (callback != null) {
        return callback(err, res);
      }
    });
  };
  function repeatString$(str, n){
    for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
    return r;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
