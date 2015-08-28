(function(){
  RegisterActivity({
    is: 'typeword-activity',
    properties: {
      word: {
        type: String,
        value: '',
        observer: 'wordChanged'
      },
      difficulty: {
        type: Number,
        value: 0,
        observer: 'shownKeysChanged'
      },
      partialword: {
        type: String,
        value: '',
        observer: 'partialwordChanged'
      }
    },
    playword: function(success){
      var playlist;
      if (this.word == null || this.word.length === 0) {
        return;
      }
      playlist = ['type the word', this.word];
      if (success != null && success === true) {
        playlist.unshift({
          file: 'success.mp3'
        });
      }
      return play_multiple_sounds(playlist);
    },
    wordChanged: function(){
      this.playword();
      return this.shownKeysChanged();
    },
    partialwordChanged: function(){
      this.$$('#inputarea').innerText = this.partialword;
      return this.shownKeysChanged();
    },
    keyTyped: function(evt, key){
      var keyboard, letter, next_letter, newkeys, x, this$ = this;
      keyboard = this.$$('#keyboard');
      letter = key.keytext;
      next_letter = this.nextLetter();
      if (letter !== next_letter) {
        this.incorrect += 1;
        play_multiple_sounds([
          {
            sound: 'wrong'
          }, 'you typed the letter', {
            letter: letter
          }, 'instead type the letter', {
            letter: next_letter
          }
        ]);
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
        if (this.partialword + letter === this.word) {
          if (this.difficulty < 2) {
            this.difficulty += 1;
            play_letter_sound(letter, function(){
              return this$.playword(true);
            });
          } else {
            play_multiple_sounds([
              {
                letter: letter
              }, {
                sound: 'success'
              }, 'you typed the word', this.word
            ], function(){
              return this$.fire('task-finished', this$);
            });
          }
          return this.partialword = '';
        } else {
          play_letter_sound(letter);
          return this.partialword = this.partialword + letter;
        }
      }
    },
    nextLetter: function(){
      if (this.word === this.partialword || this.word == null || this.partialword == null) {
        return '';
      }
      return this.word[this.partialword.length];
    },
    shownKeysChanged: function(){
      var keyboard, next_letter;
      this.incorrect = 0;
      keyboard = this.$$('#keyboard');
      next_letter = this.nextLetter();
      if (this.partialword != null) {
        this.$$('#wordspan').highlightidx = this.partialword.length;
      }
      keyboard.highlightkey = '';
      if (this.difficulty === 0) {
        keyboard.shownkeys = next_letter;
      }
      if (this.difficulty === 1) {
        keyboard.shownkeys = this.word;
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
