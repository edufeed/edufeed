(function(){
  RegisterActivity({
    is: 'typeletter-activity',
    properties: {
      word: {
        type: String,
        value: '',
        observer: 'wordChanged'
      },
      letter: {
        type: String,
        computed: 'getFirstLetter(word)'
      }
    },
    playword: function(){
      if (this.word == null || this.word.length === 0) {
        return;
      }
      return synthesize_word(this.word);
    },
    getFirstLetter: function(word){
      return word[0];
    },
    wordChanged: function(){
      this.playword();
      return this.shownKeysChanged();
    },
    nextLetter: function(){
      return this.word[0];
    },
    keyTyped: function(evt, key){
      var keyboard, letter, next_letter, newkeys, x, this$ = this;
      keyboard = this.$$('#keyboard');
      letter = key.keytext;
      next_letter = this.letter;
      if (letter !== next_letter) {
        this.incorrect += 1;
        play_wrong_sound();
        newkeys = (function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = keyboard.shownkeys.split('')).length; i$ < len$; ++i$) {
            x = ref$[i$];
            if (x !== letter) {
              results$.push(x);
            }
          }
          return results$;
        }()).join('');
        keyboard.highlightkey = next_letter;
      }
      if (letter === next_letter) {
        return setTimeout(function(){
          this$.playword();
          return this$.fire('task-finished', this$);
        }, 1000);
      }
    },
    shownKeysChanged: function(){
      var keyboard;
      this.incorrect = 0;
      keyboard = this.$$('#keyboard');
      this.$$('#wordspan').highlightidx = 0;
      return keyboard.shownkeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].join('');
    }
  });
}).call(this);
