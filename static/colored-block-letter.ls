Polymer {
  is: 'colored-block-letter'
  properties: {
    keyscale: {
      type: Number
      value: 1.0
      observer: 'keyscaleChanged'
    }
    letter: {
      type: String
      value: ''
      observer: 'letterChanged'
    }
    highlighted: {
      type: Boolean
      value: false
      observer: 'letterChanged'
    }
    width: {
      type: Number
      value: 2
      observer: 'widthChanged'
    }
    height: {
      type: Number
      value: 2
      observer: 'heightChanged'
    }
  }
  getHighlightColor: ->
    key = this.letter
    if [\a to \z].indexOf(key) == -1
      return 'white'
    return getKeyColor(key)
  letterChanged: ->
    highlight_color = this.getHighlightColor()
    this.style.backgroundColor = highlight_color
  widthChanged: ->
    this.style.width = Math.round(this.width*25*this.keyscale) + 'px'
  heightChanged: ->
    this.style.height = Math.round(this.height*25*this.keyscale) + 'px'
    this.style.fontSize = Math.round(this.height*16*this.keyscale) + 'px'
    this.style.lineHeight = Math.round(this.height*25*this.keyscale) + 'px'
  keyscaleChanged: ->
    this.widthChanged()
    this.heightChanged()
}
