(function(){
  Polymer({
    is: 'learner-keyboard',
    properties: {
      keylines: {
        type: Array,
        value: [
          [
            {
              text: 'a',
              width: 4,
              marginright: 0.5
            }, {
              text: 'm',
              marginright: 0.5
            }, 'b', {
              text: 'p',
              marginright: 0.5
            }, 'f', 'v'
          ], [
            'e', {
              text: 'o',
              marginright: 0.5
            }, {
              text: 'n',
              marginright: 0.5
            }, 'd', {
              text: 't',
              marginright: 0.5
            }, 's', 'z'
          ], [
            'i', {
              text: 'u',
              marginright: 0.5
            }, {
              text: 'l',
              marginright: 0.5
            }, {
              text: 'g',
              sound: 'g_hard'
            }, {
              text: 'c',
              sound: 'c_hard',
              marginright: 0.5
            }, {
              text: 'c',
              sound: 'c_soft'
            }, {
              text: 'g',
              sound: 'g_soft'
            }
          ], [
            'y', {
              text: 'w',
              marginright: 0.5
            }, {
              text: 'r',
              marginright: 0.5
            }, {
              text: 'q',
              width: 4 / 3
            }, {
              text: 'x',
              width: 4 / 3
            }, {
              text: 'k',
              width: 4 / 3,
              marginright: 0.5
            }, 'h', 'j'
          ]
        ]
      },
      hidebackspace: {
        type: Boolean,
        value: false,
        observer: 'hiddenKeysChanged'
      },
      shownkeys: {
        type: String,
        value: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].join(''),
        observer: 'hiddenKeysChanged'
      },
      hiddensounds: {
        type: Array,
        value: [],
        observer: 'hiddenKeysChanged'
      },
      highlightkey: {
        type: String,
        value: '',
        observer: 'highlightkeyChanged'
      },
      silent: {
        type: Boolean,
        value: false
      }
    },
    getKeysInSameSection: function(key){
      var sections, output, i$, len$, section;
      sections = ['aeoiuyw', 'mnlr', 'bpdtgcqxk', 'fvszcghj'];
      output = [];
      for (i$ = 0, len$ = sections.length; i$ < len$; ++i$) {
        section = sections[i$];
        if (section.indexOf(key) !== -1) {
          output.push(section);
        }
      }
      return output.join('');
    },
    keyTyped: function(evt, key){
      this.fire('key-typed', key);
    }
    /*
    attached: ->
      self = this
      setTimeout ->
        console.log 'ready!'
        console.log $(self).find('keyboard-button')
        for x in $(self).find('keyboard-button')
          console.log x
          x.clickcallback = self.keyClicked
      , 1000
    */,
    isKeySpecial: function(key){
      if (key.special === 'backspace') {
        return 'backspace';
      }
      return '';
    },
    getKeyColor: function(key){
      var keysound;
      keysound = key.sound;
      key = this.getKeyText(key);
      return getKeyColor(key, keysound);
    },
    getKeySound: function(key){
      if (key.sound != null) {
        return key.sound;
      }
      return '';
    },
    getKeyText: function(key){
      if (typeof key === typeof '') {
        return key;
      } else {
        return key.text;
      }
    },
    getKeyWidth: function(key){
      if (key.width != null) {
        return key.width;
      }
      return 2;
    },
    getKeyHeight: function(key){
      if (key.height != null) {
        return key.height;
      }
      return 2;
    },
    getKeyMarginLeft: function(key){
      if (key.marginleft != null) {
        return key.marginleft;
      }
      return 0;
    },
    getKeyMarginRight: function(key){
      if (key.marginright != null) {
        return key.marginright;
      }
      return 0;
    },
    getKeyMarginTop: function(key){
      if (key.margintop != null) {
        return key.margintop;
      }
      return 0;
    },
    getKeyId: function(key){
      key = this.getKeyText(key);
      return 'key' + key;
    },
    hiddenKeysChanged: function(newvalue, oldvalue){
      var i$, ref$, len$, x, results$ = [];
      for (i$ = 0, len$ = (ref$ = $(this).find('keyboard-button')).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(x.ishidden = this.isKeyHidden(x.keytext, x.sound));
      }
      return results$;
    },
    getKeyOpacity: function(key){
      key = this.getKeyText(key);
      if (this.highlightkey == null || this.highlightkey.length === 0) {
        return 1.0;
      }
      if (this.highlightkey === key) {
        return 1.0;
      }
      return 0.2;
    },
    brightenAllKeys: function(){
      var i$, ref$, len$, x, results$ = [];
      for (i$ = 0, len$ = (ref$ = $(this).find('keyboard-button')).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(x.opacity = 1.0);
      }
      return results$;
    },
    darkenAllKeys: function(){
      var i$, ref$, len$, x, results$ = [];
      for (i$ = 0, len$ = (ref$ = $(this).find('keyboard-button')).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(x.opacity = 0.2);
      }
      return results$;
    },
    highlightkeyChanged: function(newvalue, oldvalue){
      var i$, ref$, len$, x, results$ = [];
      for (i$ = 0, len$ = (ref$ = $(this).find('keyboard-button')).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(x.opacity = this.getKeyOpacity(x.keytext));
      }
      return results$;
    },
    isKeyHidden: function(key, sound){
      key = this.getKeyText(key);
      if (sound != null) {
        if (this.hiddensounds.indexOf(sound) !== -1) {
          return true;
        }
      }
      if (key === '←') {
        return this.hidebackspace;
      }
      return this.shownkeys.indexOf(key) === -1;
    }
  });
}).call(this);
