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
            self.S('#targetinput').val(username.trim());
            return getBoolParam('skipsharescreen', function(skipsharescreen){
              return getBoolParam('hidesharebutton', function(hidesharebutton){
                return getBoolParam('hidehelpbutton', function(hidehelpbutton){
                  return getBoolParam('maketransparentbutton', function(maketransparentbutton){
                    return getParam('suggestionformula', function(suggestionformula){
                      self.S('#skipsharescreen').prop('checked', skipsharescreen);
                      self.S('#hidesharebutton').prop('checked', hidesharebutton);
                      self.S('#hidehelpbutton').prop('checked', hidehelpbutton);
                      self.S('#maketransparentbutton').prop('checked', maketransparentbutton);
                      return getAllUsers(function(all_users){
                        var fastlogin_buttons, i$, len$;
                        fastlogin_buttons = $(self).find('#fastlogin_buttons');
                        for (i$ = 0, len$ = all_users.length; i$ < len$; ++i$) {
                          (fn$.call(this, all_users[i$]));
                        }
                        console.log(suggestionformula);
                        return setTimeout(function(){
                          if (suggestionformula != null && suggestionformula.length > 0) {
                            return self.S('#selectsuggestionformula').val(suggestionformula);
                          } else {
                            return self.S('#selectsuggestionformula').val('default');
                          }
                        }, 0);
                        function fn$(current_user){
                          var new_fastlogin_button;
                          new_fastlogin_button = $("<button class='btn btn-lg btn-primary'>").text(current_user).click(function(){
                            self.S('#usernameinput').val(current_user);
                            self.S('#passwordinput').val(current_user);
                            return self.setUsername();
                          });
                          new_fastlogin_button.appendTo(fastlogin_buttons);
                          fastlogin_buttons.append(' ');
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    },
    appcacheStatus: function(){
      return ['uncached', 'idle', 'checking', 'downloading', 'updateready'][window.applicationCache.status];
    },
    getSuggestionFormulas: function(){
      var k, v;
      return (function(){
        var ref$, results$ = [];
        for (k in ref$ = getTaskSuggestionFormulas()) {
          v = ref$[k];
          results$.push(k);
        }
        return results$;
      }());
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
    deleteLocalFeedItemsDb: function(){
      var self;
      self = this;
      return getUsername(function(username){
        return deleteLocalDb("feeditems_" + username, function(){
          return self.fire('task-left', self);
        });
      });
    },
    deleteLocalFinishedItemsDb: function(){
      var self;
      self = this;
      return getUsername(function(username){
        return deleteLocalDb("finisheditems_" + username, function(){
          return self.fire('task-left', self);
        });
      });
    },
    deleteLocalLogsDb: function(){
      var self;
      self = this;
      return getUsername(function(username){
        return deleteLocalDb("logs_" + username, function(){
          return self.fire('task-left', self);
        });
      });
    },
    deleteLocalFeedItemsDbAllUsers: function(){
      var self;
      self = this;
      return getAllUsers(function(all_users){
        return async.eachSeries(all_users, function(username, callback){
          return deleteLocalDb("feeditems_" + username, function(){
            return callback(null, null);
          });
        }, function(){
          return self.fire('task-left', self);
        });
      });
    },
    deleteLocalFinishedItemsDbAllUsers: function(){
      var self;
      self = this;
      return getAllUsers(function(all_users){
        return async.eachSeries(all_users, function(username, callback){
          return deleteLocalDb("finisheditems_" + username, function(){
            return callback(null, null);
          });
        }, function(){
          return self.fire('task-left', self);
        });
      });
    },
    deleteLocalLogsDbAllUsers: function(){
      var self;
      self = this;
      return getAllUsers(function(all_users){
        return async.eachSeries(all_users, function(username, callback){
          return deleteLocalDb("logs_" + username, function(){
            return callback(null, null);
          });
        }, function(){
          return self.fire('task-left', self);
        });
      });
    },
    clearLogs: function(){
      var self;
      self = this;
      return getUsername(function(username){
        return clearDb("logs_" + username, function(){
          return self.fire('task-left', self);
        });
      });
    },
    hideAdminActivity: function(){
      console.log('hideAdminActivity');
      this.fire('hide-admin-activity', this);
      return this.fire('task-left', this);
    },
    skipsharescreen_changed: function(evt){
      var checked;
      checked = false;
      if (evt != null && evt.target != null && evt.target.checked != null && evt.target.checked === true) {
        checked = true;
      }
      return setParam('skipsharescreen', checked);
    },
    hidesharebutton_changed: function(evt){
      var checked;
      checked = false;
      if (evt != null && evt.target != null && evt.target.checked != null && evt.target.checked === true) {
        checked = true;
      }
      if (checked) {
        this.fire('hide-share-button', this);
      } else {
        this.fire('show-share-button', this);
      }
      return setParam('hidesharebutton', checked);
    },
    hidehelpbutton_changed: function(evt){
      var checked;
      checked = false;
      if (evt != null && evt.target != null && evt.target.checked != null && evt.target.checked === true) {
        checked = true;
      }
      if (checked) {
        this.fire('hide-help-button', this);
      } else {
        this.fire('show-help-button', this);
      }
      return setParam('hidehelpbutton', checked);
    },
    maketransparentbutton_changed: function(evt){
      var checked;
      checked = false;
      if (evt != null && evt.target != null && evt.target.checked != null && evt.target.checked === true) {
        checked = true;
      }
      if (checked) {
        this.fire('make-all-buttons-transparent', this);
      } else {
        this.fire('make-all-buttons-opaque', this);
      }
      return setParam('maketransparentbutton', checked);
    },
    suggestionformula_changed: function(evt){
      var new_suggestion_formula;
      new_suggestion_formula = 'default';
      if (evt != null && evt.target != null && evt.target.value != null) {
        new_suggestion_formula = evt.target.value;
      }
      return setParam('suggestionformula', new_suggestion_formula);
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
          return self.fire('task-left', self);
        });
      });
    },
    clearFinishedItems: function(){
      var self;
      self = this;
      return getUsername(function(username){
        return clearDb("finisheditems_" + username, function(){
          return self.fire('task-left', self);
        });
      });
    },
    getSampleFeedItemCategories: function(){
      var k, v;
      return (function(){
        var ref$, results$ = [];
        for (k in ref$ = getSampleFeedItems()) {
          v = ref$[k];
          results$.push(k);
        }
        return results$;
      }());
    },
    addSampleItems: function(obj){
      var self, itemtype, username, items;
      self = this;
      itemtype = 'defaults';
      if (obj != null && obj.srcElement != null && obj.srcElement.dataItem != null) {
        itemtype = obj.srcElement.dataItem;
      }
      username = self.S('#targetinput').val().trim();
      items = getSampleFeedItems()[itemtype];
      return async.each(items, function(item, callback){
        return postItem("feeditems_" + username, item, callback);
      }, function(results){
        return self.fire('task-left', self);
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
          return self.fire('task-left', self);
        });
      });
    },
    displayLogs: function(){
      var this$ = this;
      return getlogs(function(logs){
        return this$.S('#logdisplay').text(JSON.stringify(logs, null, 2));
      });
    },
    displayErrors: function(){
      var this$ = this;
      return geterrors(function(errors){
        return this$.S('#errordisplay').text(JSON.stringify(errors, null, 2));
      });
    },
    displayLogAnalysis: function(){
      var this$ = this;
      return getlogs(function(logs){
        return this$.S('#loganalysisdisplay').text(getLogAnalysisResultsAsString(logs));
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
