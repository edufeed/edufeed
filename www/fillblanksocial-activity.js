(function(){
  RegisterActivity({
    is: 'fillblanksocial-activity',
    properties: {
      sentence: {
        type: String,
        value: 'My favorite color is ⬜⬜⬜⬜⬜.'
      },
      howaboutyou: {
        type: String,
        value: 'How about you?'
      },
      fillinblank: {
        type: String,
        value: 'fill in the blank'
      },
      entered: {
        type: String,
        value: '⬜⬜⬜⬜⬜'
      },
      filledsentence: {
        type: String,
        computed: 'compute_filledsentence(sentence, entered)',
        observer: 'filledsentence_changed'
      },
      firstfilledsentence: {
        type: String,
        computed: 'compute_firstfilledsentence(sentence, firstentered)'
      },
      firstentered: {
        type: String,
        value: '⬜⬜⬜⬜⬜'
      },
      firstsentence: {
        type: String,
        computed: 'compute_firstsentence(firstfilledsentence, social, howaboutyou)'
      },
      wordoptions: {
        type: Array,
        value: []
      }
    },
    saySentence1: function(){
      return this.$$('#sentence1').playSentence();
    },
    saySentence2: function(){
      return this.$$('#sentence2').playSentence();
    },
    compute_firstfilledsentence: function(sentence, firstentered){
      return sentence.split('⬜⬜⬜⬜⬜').join(firstentered);
    },
    compute_firstsentence: function(firstfilledsentence, social, howaboutyou){
      return capitalizeFirstLetter(social.poster) + " says: " + firstfilledsentence + " " + howaboutyou;
    },
    filledsentence_changed: function(newval, oldval){
      if (!this.firstplay) {
        return;
      }
      return this.$$('#sentence2').playSentence();
    },
    compute_filledsentence: function(sentence, entered){
      return sentence.split('⬜⬜⬜⬜⬜').join(entered);
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
      setSocialSharingData('fillblanksocial', {
        firstentered: word
      });
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
        this$.$$('#sentence1').playSentence();
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
