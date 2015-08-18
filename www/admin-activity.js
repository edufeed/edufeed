(function(){
  RegisterActivity({
    is: 'admin-activity',
    S: function(pattern){
      return $(this.$$(pattern));
    },
    ready: function(){
      var self;
      self = this;
      return getUsername(function(username){
        return getPassword(function(password){
          return getCouchURL(function(couchserver){
            self.S('#usernameinput').val(username);
            self.S('#passwordinput').val(password);
            self.S('#couchserverinput').val(couchserver);
            self.S('#itemtypeinput').val('typeword');
            self.S('#datainput').val(jsyaml.safeDump({
              word: 'cat'
            }).trim());
            self.S('#socialinput').val(jsyaml.safeDump({
              poster: username
            }).trim());
            return self.S('#targetinput').val(username.trim());
          });
        });
      });
    },
    appcacheStatus: function(){
      return ['uncached', 'idle', 'checking', 'downloading', 'updateready'][window.applicationCache.status];
    },
    reallySetUsername: function(username, password, couchserver){
      return setUsername(username, function(){
        return setPassword(password, function(){
          return setCouchURL(couchserver, function(){
            return window.location.reload();
          });
        });
      });
    },
    setUsername: function(){
      var self, username, password, couchserver;
      self = this;
      username = this.S('#usernameinput').val().trim();
      password = this.S('#passwordinput').val().trim();
      couchserver = this.S('#couchserverinput').val().trim();
      return (function(login_successful){
        if (!login_successful) {
          return bootbox.confirm("Login was unsuccessful, are you sure you would like to update the stored username and password?", function(certain){
            if (certain) {
              return self.reallySetUsername(username, password, couchserver);
            } else {
              return getUsername(function(nusername){
                return getPassword(function(npassword){
                  return getCouchURL(function(ncouchserver){
                    self.S('#usernameinput').val(nusername);
                    self.S('#passwordinput').val(npassword);
                    return self.S('#couchserverinput').val(ncouchserver);
                  });
                });
              });
            }
          });
        } else {
          return self.reallySetUsername(username, password, couchserver);
        }
      }.call(this, true));
    },
    makeFullScreen: function(){
      var ssfeed, rfs;
      ssfeed = $('side-scroll-feed')[0];
      rfs = document.body.mozRequestFullScreen || document.body.webkitRequestFullScreen || document.body.requestFullScreen;
      if (rfs) {
        return rfs.call(ssfeed);
      }
    },
    clearItems: function(){
      var self;
      self = this;
      return getUsername(function(username){
        return clearDb("feeditems_" + username, function(){
          return self.fire('task-finished', self);
        });
      });
    },
    addSampleItems: function(){
      var self;
      self = this;
      return getUsername(function(username){
        var wordlist, items, levelnum, data, word;
        wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear'];
        items = [
          {
            itemtype: 'admin',
            social: {
              poster: 'horse'
            }
          }, {
            itemtype: 'example',
            data: {
              foo: 'somefooval',
              bar: 'somebarval'
            },
            social: {
              poster: 'mouse',
              finishedby: ['elephant']
            }
          }
        ].concat((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = [0, 1, 2]).length; i$ < len$; ++i$) {
            levelnum = ref$[i$];
            results$.push({
              itemtype: 'bars',
              data: {
                level: levelnum
              },
              social: {
                poster: 'dog'
              }
            });
          }
          return results$;
        }()), (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = [
            {
              numdots: 7,
              targetformula: '_x_=_'
            }, {
              numdots: 4,
              targetformula: '3x4=_'
            }, {
              numdots: 6,
              targetformula: '_x6=18'
            }, {
              numdots: 5,
              targetformula: '3x_=15'
            }, {
              numdots: 8,
              targetformula: '_x_=24'
            }
          ]).length; i$ < len$; ++i$) {
            data = ref$[i$];
            results$.push({
              itemtype: 'dots',
              data: data,
              social: {
                poster: 'mouse'
              }
            });
          }
          return results$;
        }()), (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = wordlist).length; i$ < len$; ++i$) {
            word = ref$[i$];
            results$.push({
              itemtype: 'typeletter',
              data: {
                word: word
              },
              social: {
                poster: 'dog',
                finishedby: ['zebra']
              }
            });
          }
          return results$;
        }()), (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = wordlist).length; i$ < len$; ++i$) {
            word = ref$[i$];
            results$.push({
              itemtype: 'typeword',
              data: {
                word: word
              },
              social: {
                poster: 'dog',
                finishedby: ['zebra']
              }
            });
          }
          return results$;
        }()));
        return async.each(items, function(item, callback){
          return postItem("feeditems_" + username, item, callback);
        }, function(results){
          return self.fire('task-finished', self);
        });
      });
    },
    addCustomItem: function(){
      var self, itemtype;
      console.log('addCustomItem called');
      self = this;
      itemtype = this.S('#itemtypeinput').val();
      if (itemtype == null || itemtype.length === 0) {
        alert('must specify itemtype');
        return;
      }
      return getUsername(function(username){
        var data_text, data, social_text, social, target;
        data_text = self.S('#datainput').val().trim();
        data = jsyaml.safeLoad(data_text);
        social_text = self.S('#socialinput').val().trim();
        social = jsyaml.safeLoad(social_text);
        target = self.S('#targetinput').val().trim();
        return postItemToTarget(target, {
          itemtype: itemtype,
          data: data,
          social: social
        }, function(){
          return self.fire('task-finished', self);
        });
      });
    },
    displayLogs: function(){
      var this$ = this;
      return getlogs(function(logs){
        return this$.S('#logdisplay').text(JSON.stringify(logs, null, 2));
      });
    },
    downloadLogs: function(){
      var this$ = this;
      return getlogs(function(logs){
        return document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      });
    }
  });
}).call(this);
