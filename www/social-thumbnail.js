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
      myname: {
        type: String,
        value: ''
      },
      finished: {
        type: Boolean,
        computed: 'compute_finished(finishedby, myname)',
        observer: 'finished_changed'
      }
    },
    compute_finished: function(finishedby, myname){
      if (finishedby == null || myname == null) {
        return false;
      }
      return finishedby.indexOf(myname) >= 0;
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
