(function(){
  RegisterActivity({
    is: 'readaloud-activity',
    properties: {
      sentences: {
        type: Array,
        value: ['Why do elephants never forget?', 'Because nobody ever tells them anything!']
      }
    },
    ready: function(){
      var this$ = this;
      return setTimeout(function(){
        return this$.fire('task-freeplay', this$);
      }, 0);
    }
  });
}).call(this);
