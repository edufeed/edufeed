(function(){
  RegisterActivity({
    is: 'iframe-activity',
    properties: {
      activitypage: {
        type: String,
        value: 'iframe-example.html'
      },
      activityurl: {
        type: String,
        computed: 'compute_activityurl(activitypage, params)'
      },
      params: {
        type: Object,
        value: {
          foo: 'hello',
          bar: 'world'
        }
      }
    },
    compute_activityurl: function(activitypage, params){
      var separator;
      separator = '?';
      if (activitypage.indexOf('?') !== -1) {
        separator = '&';
      }
      return activitypage + separator + $.param(params);
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
