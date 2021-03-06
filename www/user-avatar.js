// Generated by LiveScript 1.3.1
(function(){
  Polymer({
    is: 'user-avatar',
    properties: {
      username: {
        type: String,
        value: '',
        observer: 'usernameChanged'
      },
      checked: {
        type: Boolean,
        value: false,
        observer: 'checkedChanged'
      },
      size: {
        type: String,
        value: 'r',
        observer: 'sizeChanged'
      }
    },
    sizeChanged: function(){
      if (this.size === 's') {
        this.$$('#profilepic').width = 50;
        return this.$$('#profilepic').height = 50;
      } else if (this.size === 'r') {
        this.$$('#profilepic').width = 100;
        return this.$$('#profilepic').height = 100;
      } else if (this.size === 'l') {
        this.$$('#profilepic').width = 350;
        return this.$$('#profilepic').height = 350;
      } else if (this.size === 'm') {
        this.$$('#profilepic').width = 150;
        return this.$$('#profilepic').height = 150;
      }
    },
    usernameChanged: function(newname, oldname){
      var this$ = this;
      if (newname === oldname) {
        return;
      }
      return get_profilepic_paths(function(profilepic_paths){
        if (newname !== this$.username) {
          return;
        }
        if (profilepic_paths[newname] != null) {
          return this$.$$('#profilepic').imgsrc = profilepic_paths[newname];
        } else {
          return this$.$$('#profilepic').query = newname;
        }
      });
    },
    checkedChanged: function(){
      if (this.checked) {
        return $(this.$$('#checkmark')).show();
      } else {
        return $(this.$$('#checkmark')).hide();
      }
    }
  });
}).call(this);
