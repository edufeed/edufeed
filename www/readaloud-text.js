(function(){
  RegisterActivity({
    is: 'readaloud-text',
    properties: {
      text: {
        type: String,
        value: 'Why do elephants never forget?'
      },
      wordlist: {
        type: Array,
        computed: 'splitWordsInSentence(text)'
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
    getWordId: function(wordidx){
      return "word_" + wordidx;
    },
    playSentence: function(){
      var self, wordlist, playlist, res$, i$, len$, word;
      self = this;
      wordlist = this.wordlist;
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
          wordspan = self.S('#' + self.getWordId(wordidx));
          return wordspan.addClass('highlighted');
        },
        done: function(){
          return self.S('.highlighted').removeClass('highlighted');
        }
      });
    },
    sentenceClicked: function(obj, evt){
      return this.playSentence();
    },
    playWord: function(wordidx){
      var self, word, wordspan;
      self = this;
      word = this.wordlist[wordidx];
      self.S('.highlighted').removeClass('highlighted');
      wordspan = self.S('#' + self.getWordId(wordidx));
      wordspan.addClass('highlighted');
      return synthesize_word(word.toLowerCase(), function(){
        return self.S('.highlighted').removeClass('highlighted');
      });
    },
    wordClicked: function(obj, evt){
      var wordidx;
      wordidx = obj.target.wordidx;
      return this.playWord(wordidx);
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
