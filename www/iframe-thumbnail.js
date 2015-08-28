(function(){
  RegisterThumbnail({
    is: 'iframe-thumbnail',
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
      var separator, nparams;
      separator = '?';
      if (thumbnailpage.indexOf('?') !== -1) {
        separator = '&';
      }
      nparams = import$({
        activitypage: this.activitypage,
        activityurl: this.activityurl,
        isthumbnail: true
      }, params);
      return thumbnailpage + separator + $.param(nparams);
    }
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
