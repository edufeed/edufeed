(function(){
  var restler, crypto, getsecret, couchdb_server, couchdb_user, couchdb_password, couchdb_url, nano, is_couchdb_running, does_user_exist, couch_put, signup_user, signup_couchdb, signup_cloudant, out$ = typeof exports != 'undefined' && exports || this;
  restler = require('restler');
  crypto = require('crypto');
  getsecret = require('getsecret');
  couchdb_server = getsecret('couchdb_server');
  couchdb_user = getsecret('couchdb_user');
  couchdb_password = getsecret('couchdb_password');
  couchdb_url = "https://" + couchdb_user + ":" + couchdb_password + "@" + couchdb_server + "/";
  if (couchdb_server == null) {
    couchdb_server = '127.0.0.1:5984';
    couchdb_url = 'http://127.0.0.1:5984/';
  }
  out$.couchdb_server = couchdb_server;
  out$.couchdb_url = couchdb_url;
  nano = require('nano')(couchdb_url);
  out$.is_couchdb_running = is_couchdb_running = function(callback){
    return restler.get(couchdb_url, {
      parser: restler.parsers.json
    }).on('complete', function(result){
      if (result != null && (result.couchdb != null || result['express-pouchdb'] != null)) {
        callback(true);
        return;
      }
      return callback(false);
    });
  };
  out$.does_user_exist = does_user_exist = function(username, callback){
    var users;
    users = nano.use('_users');
    return users.list(function(err1, results){
      var users, i$, ref$, len$, doc;
      if (err1 != null) {
        console.log(err1);
      }
      users = [];
      for (i$ = 0, len$ = (ref$ = results.rows).length; i$ < len$; ++i$) {
        doc = ref$[i$];
        if (doc.id.indexOf('org.couchdb.user:') !== -1) {
          users.push(doc.id.split('org.couchdb.user:').join(''));
        }
      }
      if (users.indexOf(username) !== -1) {
        return callback(true);
      } else {
        return callback(false);
      }
    });
  };
  couch_put = function(url, data, callback){
    return restler.putJson(couchdb_url + url, data).on('complete', function(data, response){
      return callback(data);
    });
  };
  out$.signup_user = signup_user = function(username, password, callback){
    if (couchdb_url.indexOf('cloudant.com') === -1) {
      return signup_couchdb(username, password, callback);
    } else {
      return signup_cloudant(username, password, callback);
    }
  };
  signup_couchdb = function(username, password, callback){
    var users;
    users = nano.use('_users');
    return users.insert({
      _id: "org.couchdb.user:" + username,
      name: username,
      type: 'user',
      roles: ["logs_" + username, "feeditems_" + username, "allusers"],
      password: password
    }, function(err1){
      if (err1 != null) {
        console.log(err1);
      }
      return nano.db.create("logs_" + username, function(err2){
        if (err2 != null) {
          console.log(err2);
        }
        return couch_put("logs_" + username + "/_security", {
          members: {
            names: [username],
            roles: ["logs_" + username, "allusers"]
          }
        }, function(err3){
          if (err3 != null) {
            console.log(err3);
          }
          return nano.db.create("feeditems_" + username, function(err4){
            if (err4 != null) {
              console.log(err4);
            }
            return couch_put("feeditems_" + username + "/_security", {
              members: {
                names: [username],
                roles: ["feeditems_" + username, "allusers"]
              }
            }, function(err5){
              if (err5 != null) {
                console.log(err5);
              }
              if (callback != null) {
                return callback();
              }
            });
          });
        });
      });
    });
  };
  signup_cloudant = function(username, password, callback){
    var users, salt, hash, password_sha;
    users = nano.use('_users');
    salt = crypto.randomBytes(16).toString('hex');
    hash = crypto.createHash('sha1');
    hash.update(password + salt);
    password_sha = hash.digest('hex');
    return users.insert({
      _id: "org.couchdb.user:" + username,
      name: username,
      type: 'user',
      roles: ["logs_" + username, "feeditems_" + username, "allusers"],
      password_sha: password_sha,
      salt: salt
    }, function(err1){
      if (err1 != null) {
        console.log(err1);
      }
      return nano.db.create("logs_" + username, function(err2){
        if (err2 != null) {
          console.log(err2);
        }
        return couch_put("logs_" + username + "/_security", {
          couchdb_auth_only: true,
          members: {
            names: [username],
            roles: ["logs_" + username, "allusers"]
          }
        }, function(err3){
          if (err3 != null) {
            console.log(err3);
          }
          return nano.db.create("feeditems_" + username, function(err4){
            if (err4 != null) {
              console.log(err4);
            }
            return couch_put("feeditems_" + username + "/_security", {
              couchdb_auth_only: true,
              members: {
                names: [username],
                roles: ["feeditems_" + username, "allusers"]
              }
            }, function(err5){
              if (err5 != null) {
                console.log(err5);
              }
              if (callback != null) {
                return callback();
              }
            });
          });
        });
      });
    });
  };
}).call(this);
