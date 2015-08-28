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
      },
      difficulty: {
        type: Number,
        value: 0,
        observer: 'shownKeysChanged'
      }
    },
    playword: function(success){
      var playlist;
      if (this.word == null || this.word.length === 0) {
        return;
      }
      playlist = [
        'type the letter', {
          file: "lettersound/" + this.letter + ".mp3"
        }, 'in', this.word
      ];
      if (success != null && success) {
        playlist.unshift({
          file: 'success.mp3'
        });
      }
      return synthesize_multiple_words(playlist);
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
        if (this.difficulty < 2) {
          this.difficulty += 1;
          return setTimeout(function(){
            return this$.playword(true);
          }, 500);
        } else {
          setTimeout(function(){
            return synthesize_multiple_words([
              {
                file: 'success.mp3'
              }, 'you typed the letter', {
                file: "lettersound/" + this$.letter + ".mp3"
              }, 'in', this$.word
            ]);
          }, 500);
          return setTimeout(function(){
            return this$.fire('task-finished', this$);
          }, 1000);
        }
      }
    },
    shownKeysChanged: function(){
      var keyboard, next_letter;
      this.incorrect = 0;
      keyboard = this.$$('#keyboard');
      next_letter = this.nextLetter();
      this.$$('#wordspan').highlightidx = 0;
      keyboard.highlightkey = '';
      if (keyboard.hiddensounds.length > 0) {
        keyboard.hiddensounds = [];
      }
      if (this.difficulty === 0) {
        keyboard.shownkeys = next_letter;
      }
      if (this.difficulty === 1) {
        keyboard.shownkeys = keyboard.getKeysInSameSection(next_letter);
        if (['c', 'g'].indexOf(next_letter) === -1 && keyboard.shownkeys.indexOf('c') !== -1) {
          if (keyboard.shownkeys.indexOf('g') !== -1) {
            keyboard.hiddensounds = ['c_soft', 'g_soft'];
          } else {
            keyboard.hiddensounds = ['c_hard', 'g_hard'];
          }
        }
      }
      if (this.difficulty === 2) {
        keyboard.shownkeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].join('');
      }
      if (this.difficulty === 3) {
        keyboard.shownkeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].join('');
      }
      if (this.difficulty === 3) {
        return this.$$('#wordspan').style.visibility = 'hidden';
      } else {
        return this.$$('#wordspan').style.visibility = 'visible';
      }
    }
  });
}).call(this);
