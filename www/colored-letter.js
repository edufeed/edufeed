(function(){
  Polymer({
    is: 'colored-letter',
    properties: {
      letter: {
        type: String,
        value: '',
        observer: 'letterChanged'
      },
      highlighted: {
        type: Boolean,
        value: false,
        observer: 'letterChanged'
      }
    },
    getHighlightColor: function(){
      var key, cvowel, csemivowel, cnasal, cstop, cstop_voiced, cfricative, cfricative_voiced;
      key = this.letter;
      if (["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].indexOf(key) === -1) {
        return 'white';
      }
      cvowel = 'yellow';
      csemivowel = '#FFA500';
      cnasal = '#FF5533';
      cstop = '#77AAFF';
      cstop_voiced = '#5577FF';
      cfricative = '#AAFFAA';
      cfricative_voiced = '#00FF00';
      cstop_voiced = cstop;
      cfricative_voiced = cfricative;
      if (key === 'c' || key === 'g') {
        return '#00FFFF';
      }
      if ('yw'.indexOf(key) !== -1) {
        return csemivowel;
      }
      if ('aeoiuyw'.indexOf(key) !== -1) {
        return cvowel;
      }
      if ('mnlr'.indexOf(key) !== -1) {
        return cnasal;
      }
      if ('bdg'.indexOf(key) !== -1) {
        return cstop_voiced;
      }
      if ('bpdtgkqxc'.indexOf(key) !== -1) {
        return cstop;
      }
      if ('vzjg'.indexOf(key) !== -1) {
        return cfricative_voiced;
      }
      if ('fvszcjhg'.indexOf(key) !== -1) {
        return cfricative;
      }
    },
    letterChanged: function(){
      var highlight_color;
      highlight_color = this.getHighlightColor();
      if (!this.highlighted) {
        highlight_color = 'white';
      }
      return this.style.backgroundColor = highlight_color;
    }
  });
}).call(this);
