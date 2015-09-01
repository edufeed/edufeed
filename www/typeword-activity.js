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
        value: 0
      },
      partialword: {
        type: String,
        value: '',
        observer: 'partialwordChanged'
      }
    },
    picturePressed: function(){
      return this.playword(false);
    },
    get_instruction_playlist: function(){
      var letter;
      return ['type the word', this.word].concat((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.word).length; i$ < len$; ++i$) {
          letter = ref$[i$];
          results$.push({
            letter: letter
          });
        }
        return results$;
      }.call(this)));
    },
    playword: function(success, callback){
      var playlist, this$ = this;
      if (this.word == null || this.word.length === 0) {
        return;
      }
      playlist = this.get_instruction_playlist();
      if (success != null && success === true) {
        playlist.unshift({
          sound: 'success'
        });
      }
      return play_multiple_sounds(playlist, function(){
        if (callback != null) {
          return callback();
        }
      });
    },
    wordChanged: function(){
      var this$ = this;
      this.shownKeysChanged();
      this.disableKeyboard();
      return this.playword(false, function(){
        return this$.enableKeyboard();
      });
    },
    partialwordChanged: function(){
      this.$$('#inputarea').innerText = this.partialword;
      return this.shownKeysChanged();
    },
    keyTyped: function(evt, key){
      var keyboard, letter, letter_sound, next_letter, this$ = this;
      keyboard = this.$$('#keyboard');
      letter = key.keytext;
      letter_sound = key.sound;
      if (letter_sound == null || letter_sound.length === 0) {
        letter_sound = letter;
      }
      next_letter = this.nextLetter();
      if (letter !== next_letter) {
        this.incorrect += 1;
        this.disableKeyboard();
        play_multiple_sounds([
          {
            sound: 'wrong'
          }, 'you typed the letter', {
            letter: letter_sound
          }, 'instead type the letter', {
            letter: next_letter
          }
        ], function(){
          var newkeys, x;
          this$.enableKeyboard();
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
          return keyboard.highlightkey = next_letter;
        });
      }
      if (letter === next_letter) {
        if (this.partialword + letter === this.word) {
          if (this.difficulty < 2) {
            this.difficulty += 1;
            this.shownKeysChanged();
            this.disableKeyboard();
            play_multiple_sounds([
              {
                letter: letter_sound
              }, {
                sound: 'success'
              }
            ].concat(this.get_instruction_playlist()), function(){
              return this$.enableKeyboard();
            });
          } else {
            this.disableKeyboard();
            play_multiple_sounds([
              {
                letter: letter_sound
              }, {
                sound: 'success'
              }, 'you typed the word', this.word
            ], function(){
              this$.enableKeyboard();
              return this$.fire('task-finished', this$);
            });
          }
          return this.partialword = '';
        } else {
          play_letter_sound(letter_sound);
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
    disableKeyboard: function(){
      this.$$('#keyboard').highlightkey = '';
      this.$$('#keyboard').style.opacity = 0.2;
      return this.style['pointer-events'] = 'none';
    },
    enableKeyboard: function(){
      this.$$('#keyboard').style.opacity = 1.0;
      return this.style['pointer-events'] = 'all';
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
