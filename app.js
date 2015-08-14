(function(){
  var root, express, path, getsecret, throttle_call, request, restler, crypto, func_cache, couchdb_server, couchdb_user, couchdb_password, couchdb_url, nano, bing_api_key, Bing, app, get_binary_content, get_binary_content_as_base64, get_binary_content_as_base64_cached, get_image_url, get_image_url_throttled, get_image_url_cached, get_image_url_cached_throttled, get_imagedata_by_name, get_imagedata_by_name_cached, couch_put, signup_couchdb, signup_cloudant;
  root = typeof exports != 'undefined' && exports !== null ? exports : this;
  express = require('express');
  path = require('path');
  getsecret = require('getsecret');
  throttle_call = require('throttle_call');
  request = require('request');
  restler = require('restler');
  crypto = require('crypto');
  func_cache = require('func_cache_mongo')();
  couchdb_server = getsecret('couchdb_server');
  couchdb_user = getsecret('couchdb_user');
  couchdb_password = getsecret('couchdb_password');
  couchdb_url = "https://" + couchdb_user + ":" + couchdb_password + "@" + couchdb_server + "/";
  nano = require('nano')(couchdb_url);
  bing_api_key = getsecret('bing_api_key');
  Bing = require('node-bing-api')({
    accKey: bing_api_key
  });
  app = express();
  app.set('port', process.env.PORT || 8080);
  app.use(express['static'](path.join(__dirname, 'www')));
  app.use(require('body-parser').json());
  app.listen(app.get('port'), '0.0.0.0');
  app.get('/getcouchserver', function(req, res){
    return res.send(couchdb_server);
  });
  get_binary_content = function(url, callback){
    return request({
      url: url,
      encoding: null
    }, function(err, response, data){
      var content_type;
      content_type = response.headers['content-type'];
      return callback(data, content_type);
    });
  };
  get_binary_content_as_base64 = function(url, callback){
    return get_binary_content(url, function(data, content_type){
      var encoded_content;
      encoded_content = new Buffer(data).toString('base64');
      return callback("data:" + content_type + ";base64," + encoded_content);
    });
  };
  get_binary_content_as_base64_cached = func_cache(get_binary_content_as_base64, 'get_binary_content_as_base64');
  app.get('/proxybase64', function(req, res){
    var url;
    url = req.query.url;
    if (url == null) {
      res.send('need url');
      return;
    }
    return get_binary_content_as_base64_cached(url, function(data){
      return res.send(data);
    });
  });
  app.get('/proxy', function(req, res){
    var url;
    url = req.query.url;
    if (url == null) {
      res.send('need url');
      return;
    }
    return get_binary_content(url, function(data, content_type){
      res.setHeader('Content-Type', content_type);
      return res.send(data);
    });
  });
  get_image_url = function(query, callback){
    return Bing.images(query, {}, function(error, res2, body){
      var x;
      if (body == null || body.d == null || body.d.results == null) {
        callback([]);
        return;
      }
      return callback((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = body.d.results).length; i$ < len$; ++i$) {
          x = ref$[i$];
          results$.push(x.MediaUrl);
        }
        return results$;
      }()));
    });
  };
  get_image_url_throttled = throttle_call(get_image_url);
  get_image_url_cached = func_cache(get_image_url, 'get_image_url');
  get_image_url_cached_throttled = throttle_call(get_image_url_cached);
  app.get('/image', function(req, res){
    if (req.query.name == null) {
      res.send('mising name parameter');
      return;
    }
    return get_image_url_cached_throttled(req.query.name, function(imgurl){
      return res.send(imgurl);
    });
  });
  get_imagedata_by_name = function(query, callback){
    return get_image_url(query, function(imgurls){
      var imgurl;
      if (imgurls == null || imgurls.length === 0) {
        callback('');
        return;
      }
      imgurl = imgurls[0];
      return get_binary_content_as_base64_cached(imgurl, function(imgdata){
        return callback(imgdata);
      });
    });
  };
  get_imagedata_by_name_cached = func_cache(get_imagedata_by_name, 'get_imagedata_by_name');
  app.get('/imagedatabyname', function(req, res){
    if (req.query.name == null) {
      res.send('mising name parameter');
      return;
    }
    return get_imagedata_by_name_cached(req.query.name, function(imgdata){
      return res.send(imgdata);
    });
  });
  app.get('/getfeeditems', function(req, res){
    var wordlist, word;
    wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear'];
    return res.json([{
      itemtype: 'example',
      data: {
        foo: 'somefooval',
        bar: 'somebarval'
      },
      social: {
        poster: 'geza'
      }
    }].concat((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = wordlist).length; i$ < len$; ++i$) {
        word = ref$[i$];
        results$.push({
          itemtype: 'typeword',
          data: {
            word: word
          },
          social: {
            poster: 'someuser'
          }
        });
      }
      return results$;
    }())));
  });
  couch_put = function(url, data, callback){
    return restler.putJson(couchdb_url + url, data).on('complete', function(data, response){
      return callback(data);
    });
  };
  signup_couchdb = function(username, password, callback){
    var users;
    users = nano.use('_users');
    return users.insert({
      _id: "org.couchdb.user:" + username,
      name: username,
      type: 'user',
      roles: ["logs_" + username, "feeditems_" + username],
      password: password
    }, function(){
      return nano.db.create("logs_" + username, function(){
        return couch_put("logs_" + username + "/_security", {
          members: {
            names: [username],
            roles: ["logs_" + username]
          }
        }, function(){
          return nano.db.create("feeditems_" + username, function(){
            return couch_put("feeditems_" + username + "/_security", {
              members: {
                names: [username],
                roles: ["feeditems_" + username]
              }
            }, function(){
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
      roles: ["logs_" + username, "feeditems_" + username],
      password_sha: password_sha,
      salt: salt
    }, function(){
      return nano.db.create("logs_" + username, function(){
        return couch_put("logs_" + username + "/_security", {
          couchdb_auth_only: true,
          members: {
            names: [username],
            roles: ["logs_" + username]
          }
        }, function(){
          return nano.db.create("feeditems_" + username, function(){
            return couch_put("feeditems_" + username + "/_security", {
              couchdb_auth_only: true,
              members: {
                names: [username],
                roles: ["feeditems_" + username]
              }
            }, function(){
              if (callback != null) {
                return callback();
              }
            });
          });
        });
      });
    });
  };
  app.post('/signup', function(req, res){
    var ref$, username, password, botcheck, allowed_letters, c;
    ref$ = req.body, username = ref$.username, password = ref$.password, botcheck = ref$.botcheck;
    if (username == null) {
      res.send({
        status: 'error',
        text: 'missing username'
      });
      return;
    }
    if (password == null) {
      res.send({
        status: 'error',
        text: 'missing password'
      });
      return;
    }
    if (botcheck == null || botcheck !== '7,000') {
      res.send({
        status: 'error',
        text: 'bot check failed'
      });
      return;
    }
    allowed_letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].join('');
    if ((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = username).length; i$ < len$; ++i$) {
        c = ref$[i$];
        results$.push(allowed_letters.indexOf(c));
      }
      return results$;
    }()).indexOf(-1) !== -1) {
      res.send({
        status: 'error',
        text: 'username should contain only lowercase letters a-z'
      });
      return;
    }
    if ((function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = password).length; i$ < len$; ++i$) {
        c = ref$[i$];
        results$.push(allowed_letters.indexOf(c));
      }
      return results$;
    }()).indexOf(-1) !== -1) {
      res.send({
        status: 'error',
        text: 'password should contain only lowercase letters a-z'
      });
      return;
    }
    if (couchdb_url.indexOf('cloudant.com') === -1) {
      return signup_couchdb(username, password, function(){
        return res.send({
          status: 'success',
          text: 'User account created'
        });
      });
    } else {
      return signup_cloudant(username, password, function(){
        return res.send({
          status: 'success',
          text: 'User account created'
        });
      });
    }
  });
}).call(this);
