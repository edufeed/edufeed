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
        value: 0
      }
    },
    picturePressed: function(){
      return this.playword(false);
    },
    get_instruction_playlist: function(){
      return [
        'the word', this.word, 'starts with the letter', {
          letter: this.letter
        }, 'type the letter', {
          letter: this.letter
        }
      ];
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
    getFirstLetter: function(word){
      return word[0];
    },
    wordChanged: function(){
      var this$ = this;
      console.log('wordChanged');
      this.shownKeysChanged();
      this.disableKeyboard();
      return this.playword(false, function(){
        return this$.enableKeyboard();
      });
    },
    nextLetter: function(){
      return this.word[0];
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
    keyTyped: function(evt, key){
      var keyboard, letter, letter_sound, next_letter, this$ = this;
      keyboard = this.$$('#keyboard');
      letter = key.keytext;
      letter_sound = key.sound;
      if (letter_sound == null || letter_sound.length === 0) {
        letter_sound = letter;
      }
      next_letter = this.letter;
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
          this$.enableKeyboard();
          return keyboard.highlightkey = next_letter;
        });
      }
      if (letter === next_letter) {
        if (this.difficulty < 2) {
          this.difficulty += 1;
          this.shownKeysChanged();
          this.disableKeyboard();
          return play_multiple_sounds([
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
          return play_multiple_sounds([
            {
              letter: letter_sound
            }, {
              sound: 'success'
            }, 'you typed the letter', {
              letter: this.letter
            }, 'in', this.word
          ], function(){
            this$.enableKeyboard();
            return this$.fire('task-finished', this$);
          });
        }
      }
    },
    shownKeysChanged: function(){
      var keyboard, next_letter;
      console.log('shownKeysChanged');
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
