(function(){
  Polymer({
    is: 'sharing-button',
    isShareWidgetOpen: function(){
      if ($(this).find('#share_avatars').html().trim() !== '') {
        return true;
      }
      return false;
    },
    closeShareWidget: function(){
      return $(this).find('#share_avatars').html('');
    },
    sharebuttonClicked: function(){
      var self;
      self = this;
      if (self.isShareWidgetOpen()) {
        self.closeShareWidget();
        return;
      }
      synthesize_word('who would you like to share this with');
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
              float: 'right'
            });
            avatar.click(function(){
              synthesize_word("shared with " + classmate);
              avatar.prop('checked', true);
              return self.fire('share-activity', {
                username: classmate
              });
            });
            return $(self).find('#share_avatars').append(avatar);
          }
        });
      });
    }
  });
}).call(this);
