(function(){
  RegisterActivity({
    is: 'readaloud-activity',
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
    S: function(pattern){
      return $(this.$$(pattern));
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
    },
    getWordId: function(sentenceidx, wordidx){
      return "sentence_" + sentenceidx + "_word_" + wordidx;
    },
    sentenceClicked: function(obj, evt){
      var sentenceidx, self, wordlist, playlist, res$, i$, len$, word;
      sentenceidx = obj.target.sentenceidx;
      self = this;
      wordlist = this.sentences_split[sentenceidx];
      res$ = [];
      for (i$ = 0, len$ = wordlist.length; i$ < len$; ++i$) {
        word = wordlist[i$];
        res$.push(word.toLowerCase());
      }
      playlist = res$;
      return play_multiple_sounds(playlist, {
        startword: function(wordidx, word){
          var wordspan;
          self.S('.highlighted').removeClass('highlighted');
          wordspan = self.S('#' + self.getWordId(sentenceidx, wordidx));
          return wordspan.addClass('highlighted');
        },
        done: function(){
          return self.S('.highlighted').removeClass('highlighted');
        }
      });
    },
    wordClicked: function(obj, evt){
      var ref$, wordidx, sentenceidx, self, word, wordspan;
      ref$ = obj.target, wordidx = ref$.wordidx, sentenceidx = ref$.sentenceidx;
      console.log(this.sentences_split[sentenceidx][wordidx]);
      self = this;
      word = this.sentences_split[sentenceidx][wordidx];
      self.S('.highlighted').removeClass('highlighted');
      wordspan = self.S('#' + self.getWordId(sentenceidx, wordidx));
      wordspan.addClass('highlighted');
      return synthesize_word(word, function(){
        return self.S('.highlighted').removeClass('highlighted');
      });
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
