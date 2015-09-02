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
          return self.$$('#sharemessage').playSentence();
        }, 1000);
        return getUsername(function(username){
          return getClassmates(username, function(classmates){
            var res$, i$, len$, x, results$ = [];
            res$ = [];
            for (i$ = 0, len$ = classmates.length; i$ < len$; ++i$) {
              x = classmates[i$];
              if (x !== username) {
                res$.push(x);
              }
            }
            classmates = res$;
            for (i$ = 0, len$ = classmates.length; i$ < len$; ++i$) {
              results$.push((fn$.call(this, classmates[i$])));
            }
            return results$;
            function fn$(classmate){
              var avatar;
              avatar = $("<user-avatar username='" + classmate + "'>").css({
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
}).call(this);
