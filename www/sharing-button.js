(function(){
  Polymer({
    is: 'sharing-button',
    closeShareWidget: function(){
      return $(this).find('#share_avatars').html('');
    },
    sharebuttonClicked: function(){
      var self;
      self = this;
      if ($(self).find('#share_avatars').html().trim() !== '') {
        self.closeShareWidget();
        return;
      }
      return getUsername(function(username){
        return getClassmates(username, function(classmates){
          var i$, len$, results$ = [];
          for (i$ = 0, len$ = classmates.length; i$ < len$; ++i$) {
            results$.push((fn$.call(this, i$, classmates[i$])));
          }
          return results$;
          function fn$(idx, classmate){
            var avatar;
            if (idx % 3 === 0) {
              $(self).find('#share_avatars').append($('<div>'));
            }
            avatar = $("<user-avatar username='" + classmate + "'>");
            avatar.click(function(){
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
