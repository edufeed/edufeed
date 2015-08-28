(function(){
  RegisterThumbnail({
    is: 'balance-thumbnail',
    properties: {
      thumbnailpage: {
        type: String,
        value: 'balance.html'
      },
      thumbnailurl: {
        type: String,
        computed: 'compute_thumbnailurl(thumbnailpage, number)'
      },
      number: {
        type: Number,
        value: 1
      }
    },
    compute_thumbnailurl: function(thumbnailpage, number){
      var separator, nparams;
      separator = '?';
      if (thumbnailpage.indexOf('?') !== -1) {
        separator = '&';
      }
      nparams = {
        isthumbnail: true,
        number: number
      };
      return thumbnailpage + separator + $.param(nparams);
    }
  });
}).call(this);
