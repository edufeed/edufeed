(function(){
  Polymer({
    is: 'vertical-scroll-thumbnail',
    properties: {
      items: {
        type: Array
      },
      poster: {
        type: String,
        value: '',
        notify: true
      },
      finishedby: {
        type: Array,
        value: [],
        notify: true
      }
    }
  });
}).call(this);
