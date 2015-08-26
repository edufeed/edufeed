(function(){
  RegisterThumbnail({
    is: 'iframe-thumbnail',
    properties: {
      framepage: {
        type: String,
        value: 'iframe-example.html'
      },
      foo: {
        type: String,
        value: 'hello'
      },
      bar: {
        type: String,
        value: 'world'
      }
    }
  });
}).call(this);
