(function(){
  RegisterActivity({
    is: 'readaloud-activity',
    properties: {
      sentences: {
        type: Array,
        value: ['Why do elephants never forget?', 'Because nobody ever tells them anything!']
      }
    },
    getSentenceId: function(sentenceidx){
      return "sentence_" + sentenceidx;
    },
    ready: function(){
      var this$ = this;
      setTimeout(function(){
        return this$.fire('task-freeplay', this$);
      }, 0);
      return setTimeout(function(){
        return this$.$$('#' + this$.getSentenceId(0)).playSentence();
      }, 100);
    }
  });
}).call(this);
