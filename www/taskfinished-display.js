// Generated by LiveScript 1.3.1
(function(){
  Polymer({
    is: 'taskfinished-display',
    properties: {},
    S: function(pattern){
      return $(this.$$(pattern));
    },
    closeTaskFinishedDisplay: function(){
      console.log('close task finished display!');
      return this.fire('close-taskfinished', this);
    },
    ready: function(){
      var self;
      self = this;
      return getBoolParam('skipsharescreen', function(skipsharescreen){
        if (skipsharescreen) {
          self.style.opacity = 0.0;
          setTimeout(function(){
            return self.fire('close-taskfinished', this);
          }, 0);
          return;
        } else {
          self.style.opacity = 1.0;
        }
        setTimeout(function(){
          return synthesize_word('with whom do you want to share this activity');
        }, 1000);
        return getUsername(function(username){
          return getClassmates(username, function(all_classmates){
            var res$, i$, len$, x, classmates, classmatesPicked, maxShared, i, results$ = [];
            res$ = [];
            for (i$ = 0, len$ = all_classmates.length; i$ < len$; ++i$) {
              x = all_classmates[i$];
              if (x !== username) {
                res$.push(x);
              }
            }
            all_classmates = res$;
            classmates = [];
            classmatesPicked = 0;
            maxShared = 3;
            if (all_classmates.length <= 3) {
              maxShared = all_classmates.length;
            }
            while (classmatesPicked < maxShared) {
              i = Math.floor(Math.random() * all_classmates.length);
              if (!in$(all_classmates[i], classmates)) {
                classmates.push(all_classmates[i]);
                classmatesPicked += 1;
              }
            }
            for (i$ = 0, len$ = classmates.length; i$ < len$; ++i$) {
              results$.push((fn$.call(this, classmates[i$])));
            }
            return results$;
            function fn$(classmate){
              var avatar;
              avatar = $("<user-avatar username='" + classmate + "' size='m'>").css({
                'cursor': 'pointer',
                'display': 'inline-block'
              });
              avatar.click(function(){
                synthesize_multiple_words(['shared with', classmate]);
                avatar.prop('checked', true);
                return self.fire('share-activity', {
                  username: classmate
                });
              });
              return avatar.appendTo(self.S('#classmate_avatars'));
            }
          });
        });
      });
    }
  });
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
