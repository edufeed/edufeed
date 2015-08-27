(function(){
  RegisterThumbnail({
    is: 'iframe-thumbnail',
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
    printParams: function(params){
      return JSON.stringify(params, null, 2);
    }
  });
}).call(this);
