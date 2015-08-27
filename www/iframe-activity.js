(function(){
  RegisterActivity({
    is: 'iframe-activity',
    properties: {
      activitypage: {
        type: String,
        value: 'iframe-activity-example.html'
      },
      activityurl: {
        type: String,
        computed: 'compute_activityurl(activitypage, params)'
      },
      thumbnailpage: {
        type: String,
        value: 'iframe-thumbnail-example.html'
      },
      thumbnailurl: {
        type: String,
        computed: 'compute_thumbnailurl(thumbnailpage, params)'
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
    compute_thumbnailurl: function(thumbnailpage, params){
      var separator;
      separator = '?';
      if (thumbnailpage.indexOf('?') !== -1) {
        separator = '&';
      }
      return thumbnailpage + separator + $.param(params);
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
