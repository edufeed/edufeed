(function(){
  RegisterThumbnail({
    is: 'iframe-thumbnail',
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
    }
  });
}).call(this);
