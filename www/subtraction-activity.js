(function(){
  RegisterActivity({
    is: 'subtraction-activity',
    properties: {
      activitypage: {
        type: String,
        value: 'subtraction.html'
      },
      activityurl: {
        type: String,
        computed: 'compute_activityurl(activitypage, diff, sub)'
      },
      diff: {
        type: Number,
        value: 2
      },
      sub: {
        type: Number,
        value: 1
      }
    },
    compute_activityurl: function(activitypage, diff, sub){
      var separator;
      separator = '?';
      if (activitypage.indexOf('?') !== -1) {
        separator = '&';
      }
      return activitypage + separator + $.param({
        diff: diff,
        sub: sub
      });
    },
    ready: function(){
      var self;
      self = this;
      return window.addEventListener('message', function(obj){
        var ref$, messagetype, data;
        if (obj == null || obj.data == null) {
          return;
        }
        ref$ = obj.data, messagetype = ref$.messagetype, data = ref$.data;
        if (messagetype === 'addlog') {
          addlog(data);
          return;
        }
        return self.fire(messagetype, self);
      });
    }
  });
}).call(this);
