(function(){
  RegisterActivity({
    is: 'fillblank-activity',
    properties: {
      sentence: {
        type: String,
        value: 'My favorite color is ________.'
      },
      fillinblank: {
        type: String,
        value: 'fill in the blank'
      },
      entered: {
        type: String,
        value: '________'
      },
      filledsentence: {
        type: String,
        computed: 'compute_filledsentence(sentence, entered)',
        observer: 'filledsentence_changed'
      },
      wordoptions: {
        type: Array,
        value: []
      }
    },
    filledsentence_changed: function(newval, oldval){
      if (!this.firstplay) {
        return;
      }
      return this.$$('#sentence').playSentence();
    },
    compute_filledsentence: function(sentence, entered){
      return sentence.split('________').join(entered);
    },
    fillword: function(evt){
      var word, i$, ref$, len$, elem, this$ = this;
      word = '';
      for (i$ = 0, len$ = (ref$ = evt.path).length; i$ < len$; ++i$) {
        elem = ref$[i$];
        if (elem.word != null) {
          word = elem.word;
          break;
        }
      }
      this.entered = word;
      return setTimeout(function(){
        return this$.fire('task-freeplay', this$);
      }, 0);
    },
    ready: function(){
      var this$ = this;
      if (this.wordoptions.length === 0) {
        this.wordoptions = getFeedWordList();
      }
      return setTimeout(function(){
        this$.$$('#sentence').playSentence();
        return this$.firstplay = true;
      }, 100);
    }
    /*
    ready: ->
      setTimeout ~>
        this.fire 'task-freeplay', this
      , 0
      setTimeout ~>
        this.$$('#sentence').playSentence()
      , 100
    */
  });
}).call(this);
