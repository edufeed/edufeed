(function(){
  RegisterActivity({
    is: 'iframe-activity',
    properties: {
      framepage: {
        type: String,
        value: 'iframe-example.html'
      },
      srcurl: {
        type: String,
        computed: 'compute_srcurl(framepage, foo, bar)'
      },
      foo: {
        type: String,
        value: 'hello'
      },
      bar: {
        type: String,
        value: 'world'
      }
    },
    compute_srcurl: function(framepage, foo, bar){
      return framepage + '?' + $.param({
        foo: foo,
        bar: bar
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
