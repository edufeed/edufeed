(function(){
  RegisterActivity({
    is: 'readaloud-activity',
    properties: {
      sentences: {
        type: Array,
        value: ['Hello world', 'World hellos you']
      },
      sentences_split: {
        type: Array,
        computed: 'splitWordsInSentences(sentences)'
      }
    },
    splitWordsInSentence: function(sentence){
      var output, curword, end_curword, i$, len$, c;
      output = [];
      curword = [];
      end_curword = function(){
        if (curword.length === 0) {
          return;
        }
        output.push(curword.join(''));
        return curword = [];
      };
      for (i$ = 0, len$ = sentence.length; i$ < len$; ++i$) {
        c = sentence[i$];
        if (c === ' ') {
          end_curword();
          output.push(c);
        } else {
          curword.push(c);
        }
      }
      end_curword();
      return output;
    },
    splitWordsInSentences: function(sentences){
      var sentence;
      return (function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = sentences).length; i$ < len$; ++i$) {
          sentence = ref$[i$];
          results$.push(this.splitWordsInSentence(sentence));
        }
        return results$;
      }.call(this));
    },
    wordClicked: function(obj, evt){
      var ref$, wordidx, sentenceidx, word;
      ref$ = obj.target, wordidx = ref$.wordidx, sentenceidx = ref$.sentenceidx;
      console.log(this.sentences_split[sentenceidx][wordidx]);
      word = this.sentences_split[sentenceidx][wordidx];
      return synthesize_word(word);
    }
    /*
    S: (pattern) ->
      $(this.$$(pattern))
    ready: ->
      this.S('#hoverspan').hover ->
        $(this).css 'background-color', 'yellow'
    showAlert: ->
      alert 'button has been clicked'
    finishTask: ->
      this.fire 'task-finished', this
    */
  });
}).call(this);
