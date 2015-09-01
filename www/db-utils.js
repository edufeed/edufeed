(function(){
  var test_if_can_login, get_couchdb_login, db_cache, remote_db_cache, db_sync_handlers, getDb, setSyncHandler, getItems, deleteLocalDb, clearDb, padWithZeros, prevUUID, makeUUID, postItem, postItemToSelf, postItemToTarget, postFinishedItem, getFinishedItems, out$ = typeof exports != 'undefined' && exports || this;
  out$.test_if_can_login = test_if_can_login = function(username, password, callback){
    return getCouchURL(function(couchurl){
      var pouchOpts, use_https, db, ajaxOpts;
      pouchOpts = {
        skipSetup: true
      };
      use_https = couchurl.indexOf('cloudant.com') !== -1;
      if (use_https) {
        db = new PouchDB("https://" + couchurl + "/logs_" + username, pouchOpts);
      } else {
        db = new PouchDB("http://" + couchurl + "/logs_" + username, pouchOpts);
      }
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
    return getUsername(function(local_username){
      var options, db, couch_options, changes, params, sync, replicatetoremote;
      if (typeof dbname !== typeof '') {
        return dbname;
      }
      if (options == null) {
        options = {};
      }
      if (db_cache[dbname] != null) {
        return db_cache[dbname];
      }
      db = db_cache[dbname] = new PouchDB(dbname, {
        auto_compaction: true
      });
      couch_options = {
        live: true,
        retry: true,
        continuous: true,
        batch_size: 500,
        batches_limit: 100,
        heartbeat: 3000,
        timeout: 3000
      };
      changes = db.changes(couch_options);
      changes.on('change', function(change){
        if (db_sync_handlers[dbname] != null) {
          return db_sync_handlers[dbname](change);
        }
      });
      params = getUrlParameters();
      sync = options.sync != null || params.sync != null || dbname.indexOf('feeditems_' + local_username) === 0 || dbname.indexOf('finisheditems_') === 0;
      replicatetoremote = options.replicatetoremote != null || params.replicatetoremote != null || dbname.indexOf('logs_') === 0 || (dbname.indexOf('feeditems_') === 0 && !sync);
      if (sync || replicatetoremote) {
        get_couchdb_login(function(couchdb_login){
          var username, password, couchurl, use_https, remote_db_url_string, remote_db;
          username = couchdb_login.username, password = couchdb_login.password, couchurl = couchdb_login.couchurl;
          use_https = couchurl.indexOf('cloudant.com') !== -1;
          if (use_https) {
            remote_db_url_string = ("https://" + username + ":" + password + "@" + couchurl + "/") + dbname;
          } else {
            remote_db_url_string = ("http://" + username + ":" + password + "@" + couchurl + "/") + dbname;
          }
          console.log(remote_db_url_string);
          remote_db = remote_db_cache[dbname] = new PouchDB(remote_db_url_string);
          if (sync) {
            return db.sync(remote_db, couch_options).on('error', function(err){
              adderror('sync error');
              return adderror(err);
            });
          } else if (replicatetoremote) {
            return db.replicate.to(remote_db, couch_options).on('error', function(err){
              adderror('replicatetoremote error');
              return adderror(err);
            });
          }
        });
      }
      return db;
    });
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
      if (data == null) {
        callback([]);
        return;
      }
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
  out$.deleteLocalDb = deleteLocalDb = function(dbname, callback){
    var db;
    db = getDb(dbname);
    return db.destroy().then(function(){
      delete db_cache[dbname];
      delete remote_db_cache[dbname];
      if (callback != null) {
        return callback();
      }
    });
  };
  /*
  export clearDb = (dbname, callback) ->
    db = getDb(dbname)
    db.allDocs({include_docs: true}).then (data) ->
      async.each data.rows, (x, ncallback) ->
        x.doc._deleted = true
        db.put x.doc, ncallback
      , (results) ->
        if callback?
          callback(null, results)
  */
  out$.clearDb = clearDb = function(dbname, callback){
    var db;
    db = getDb(dbname);
    return db.allDocs({
      include_docs: true
    }).then(function(data){
      return async.each(data.rows, function(x, ncallback){
        return db.upsert(x.doc._id, function(doc){
          doc._deleted = true;
          return doc;
        }).then(function(){
          return ncallback(null, null);
        });
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
    return padWithZeros(prevUUID.time, 13).concat(padWithZeros(prevUUID.idx, 7), padWithZeros(Math.floor(Math.random() * 9999999999), 10));
  };
  /*
  export postItem = (dbname, item, callback) ->
    #console.log 'postItem called: '
    #console.log dbname
    #console.log item
    db = getDb(dbname)
    new_item = {} <<< item
    if not new_item._id?
      new_item._id = makeUUID()
    db.put new_item, (err, res) ->
      if callback?
        callback(err, res)
  */
  out$.postItem = postItem = function(dbname, item, callback){
    var db;
    db = getDb(dbname);
    return db.upsert(makeUUID(), function(doc){
      var k, ref$, v;
      for (k in ref$ = item) {
        v = ref$[k];
        doc[k] = v;
      }
      return doc;
    }).then(function(){
      if (callback != null) {
        return callback(null, null);
      }
    });
  };
  out$.postItemToSelf = postItemToSelf = function(item, callback){
    return getUsername(function(username){
      return postItem("feeditems_" + username, item, callback);
    });
  };
  out$.postItemToTarget = postItemToTarget = function(target, item, callback){
    return getClasses(function(classes){
      var users;
      console.log('postItemToTarget');
      console.log(target);
      if (classes[target] == null) {
        postItem("feeditems_" + target, item, callback);
        return;
      }
      users = classes[target].users;
      return async.eachSeries(users, function(username, ncallback){
        return postItem("feeditems_" + username, item, ncallback);
      }, function(){
        if (callback != null) {
          return callback();
        }
      });
    });
  };
  out$.postFinishedItem = postFinishedItem = function(item, callback){
    return getUsername(function(username){
      var dbname, db;
      dbname = "finisheditems_" + username;
      db = getDb(dbname);
      return db.allDocs({
        include_docs: true
      }).then(function(alldocs){
        var allitems, res$, i$, ref$, len$, x, matches;
        res$ = [];
        for (i$ = 0, len$ = (ref$ = alldocs.rows).length; i$ < len$; ++i$) {
          x = ref$[i$];
          res$.push(x.doc);
        }
        allitems = res$;
        res$ = [];
        for (i$ = 0, len$ = allitems.length; i$ < len$; ++i$) {
          x = allitems[i$];
          if (itemtype_and_data_matches(item, x)) {
            res$.push(x);
          }
        }
        matches = res$;
        if (matches.length > 0) {
          if (callback != null) {
            callback(null, null);
          }
          return;
        }
        return postItem(dbname, item, callback);
      });
    });
  };
  /*
  export getFinishedItems = (callback) ->
    # outputs a list of finished items, with the item.social.finishedby populated.
    # note: this version only gets the items finished by the current user. might want to change it to list everybody in the class.
    username <- getUsername()
    finished_items <- getItems "finisheditems_#{username}"
    for item in finished_items
      if not item.social?
        item.social = {}
      if not item.social.finishedby?
        item.social.finishedby = []
      item.social.finishedby.push username
    callback finished_items
  */
  out$.getFinishedItems = getFinishedItems = function(callback){
    return getUsername(function(username){
      return getClassmates(username, function(classmates){
        var classmate_to_items;
        classmate_to_items = {};
        return async.each(classmates, function(classmate, ncallback){
          return getItems("finisheditems_" + classmate, function(finished_items){
            classmate_to_items[classmate] = finished_items;
            return ncallback(null, null);
          });
        }, function(){
          var output, i$, ref$, len$, classmate, items_finished_by_classmate, j$, len1$, item, matching_items, res$, k$, len2$, x;
          output = [];
          for (i$ = 0, len$ = (ref$ = classmates).length; i$ < len$; ++i$) {
            classmate = ref$[i$];
            items_finished_by_classmate = classmate_to_items[classmate];
            for (j$ = 0, len1$ = items_finished_by_classmate.length; j$ < len1$; ++j$) {
              item = items_finished_by_classmate[j$];
              res$ = [];
              for (k$ = 0, len2$ = output.length; k$ < len2$; ++k$) {
                x = output[k$];
                if (itemtype_and_data_matches(item, x)) {
                  res$.push(x);
                }
              }
              matching_items = res$;
              if (matching_items.length > 0) {
                item = matching_items[0];
              } else {
                output.push(item);
              }
              if (item.social == null) {
                item.social = {};
              }
              if (item.social.finishedby == null) {
                item.social.finishedby = [];
              }
              if (item.social.finishedby.indexOf(classmate) === -1) {
                item.social.finishedby.push(classmate);
              }
            }
          }
          return callback(output);
        });
      });
    });
  };
  function repeatString$(str, n){
    for (var r = ''; n > 0; (n >>= 1) && (str += str)) if (n & 1) r += str;
    return r;
  }
}).call(this);
