(function(){
  RegisterActivity({
    is: 'readaloud-thumbnail',
    properties: {
      sentences: {
        type: Array,
        value: ['Why do elephants never forget?', 'Because nobody ever tells them anything!']
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
        if ([' ', '?', '.', '!'].indexOf(c) !== -1) {
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
    }
  });
}).call(this);
