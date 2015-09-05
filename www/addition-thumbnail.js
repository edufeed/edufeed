(function(){
  RegisterThumbnail({
    is: 'addition-thumbnail',
    properties: {
      thumbnailpage: {
        type: String,
        value: 'addition.html'
      },
      thumbnailurl: {
        type: String,
        computed: 'compute_thumbnailurl(thumbnailpage, sum, add)'
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
    compute_thumbnailurl: function(thumbnailpage, sum, add){
      var separator, nparams;
      separator = '?';
      if (thumbnailpage.indexOf('?') !== -1) {
        separator = '&';
      }
      nparams = {
        isthumbnail: true,
        sum: sum,
        add: add
      };
      return thumbnailpage + separator + $.param(nparams);
    }
  });
}).call(this);
