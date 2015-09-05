(function(){
  RegisterActivity({
    is: 'addition-activity',
    properties: {
      activitypage: {
        type: String,
        value: 'addition.html'
      },
      activityurl: {
        type: String,
        computed: 'compute_activityurl(activitypage, sum, add)'
      },
      sum: {
        type: Number,
        value: 2
      },
      add: {
        type: Number,
        value: 1
      }
    },
    compute_activityurl: function(activitypage, sum, add){
      var separator;
      separator = '?';
      if (activitypage.indexOf('?') !== -1) {
        separator = '&';
      }
      return activitypage + separator + $.param({
        sum: sum,
        add: add
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
