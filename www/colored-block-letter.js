(function(){
  Polymer({
    is: 'colored-block-letter',
    properties: {
      keyscale: {
        type: Number,
        value: 1.0,
        observer: 'keyscaleChanged'
      },
      letter: {
        type: String,
        value: '',
        observer: 'letterChanged'
      },
      highlighted: {
        type: Boolean,
        value: false,
        observer: 'letterChanged'
      },
      width: {
        type: Number,
        value: 2,
        observer: 'widthChanged'
      },
      height: {
        type: Number,
        value: 2,
        observer: 'heightChanged'
      }
    },
    getHighlightColor: function(){
      var key;
      key = this.letter;
      if (["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].indexOf(key) === -1) {
        return 'white';
      }
      return getKeyColor(key);
    },
    letterChanged: function(){
      var highlight_color;
      highlight_color = this.getHighlightColor();
      return this.style.backgroundColor = highlight_color;
    },
    widthChanged: function(){
      return this.style.width = Math.round(this.width * 25 * this.keyscale) + 'px';
    },
    heightChanged: function(){
      this.style.height = Math.round(this.height * 25 * this.keyscale) + 'px';
      this.style.fontSize = Math.round(this.height * 16 * this.keyscale) + 'px';
      return this.style.lineHeight = Math.round(this.height * 25 * this.keyscale) + 'px';
    },
    keyscaleChanged: function(){
      this.widthChanged();
      return this.heightChanged();
    }
  });
}).call(this);
