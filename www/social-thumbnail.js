(function(){
  Polymer({
    is: 'social-thumbnail',
    properties: {
      poster: {
        type: String,
        value: ''
      },
      finishedby: {
        type: Array,
        value: []
      },
      finished: {
        type: Boolean,
        value: false,
        observer: 'finished_changed'
      }
    },
    finished_changed: function(finished){
      if (finished) {
        return this.$$('#doneicon').style.display = 'inline';
      } else {
        return this.$$('#doneicon').style.display = 'none';
      }
    }
  });
}).call(this);
