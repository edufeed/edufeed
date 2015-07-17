Polymer {
  is: 'keyboard-button'
  properties: {
    keytext: {
      type: String
      value: 'a'
      observer: 'keytextChanged'
    }
    keyscale: {
      type: Number
      value: 1.5
    }
    isspecial: {
      type: String
      value: ''
      observer: 'isspecialChanged'
    }
    ishidden: {
      type: Boolean
      value: false
      observer: 'visibilityChanged'
    }
    silent: {
      type: Boolean
      value: false
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
    marginleft: {
      type: Number
      value: 0
      observer: 'marginLeftChanged'
    }
    marginright: {
      type: Number
      value: 0
      observer: 'marginRightChanged'
    }
    margintop: {
      type: Number
      value: 0
      observer: 'marginTopChanged'
    }
    sound: {
      type: String
      value: ''
    }
    color: {
      type: String
      value: 'white'
      observer: 'colorChanged'
    }
  }
  #ready: ->
  #  if this.ishidden
  #    this.style.visibility = 'hidden'
  isspecialChanged: ->
    if this.isspecial.length == 0
      return
    console.log 'have isspecial' + this.isspecial
    if this.isspecial == 'backspace'
      console.log 'isspecial backspace'
      this.style.border = 'none'
      this.style.margin = 'none'
      this.style.height = '48px'
      this.style.padding = 'none'
      this.$$('#keytext').innerHTML = '<img src="backspace.png" style="height: 48px; margin: 0; padding: 0">'
  keytextChanged: ->
    if this.isspecial? and this.isspecial.length > 0
      return
    this.$$('#keytext').innerHTML = this.keytext
  colorChanged: ->
    this.style.backgroundColor = this.color
  marginLeftChanged: ->
    this.style.marginLeft = Math.round(25*this.keyscale*this.marginleft) + 'px'
  marginRightChanged: ->
    this.style.marginRight = Math.round(25*this.keyscale*this.marginright) + 'px'
  marginTopChanged: ->
    this.style.marginTop = Math.round(25*this.keyscale*this.margintop) + 'px'
  widthChanged: ->
    this.style.width = Math.round(this.width*25*this.keyscale) + 'px'
  heightChanged: ->
    this.style.height = Math.round(this.height*25*this.keyscale) + 'px'
    this.style.fontSize = Math.round(this.height*16*this.keyscale) + 'px'
    this.style.lineHeight = Math.round(this.height*25*this.keyscale) + 'px'
  visibilityChanged: ->
    if this.ishidden
      this.style.visibility = 'hidden'
    else
      this.style.visibility = 'visible'
  handleClick: ->
    console.log('clicked: ' + this.keytext)
    keysynth = this.$$('#keysynth')
    keysynth.pause()
    sound = this.sound
    if not sound? or sound.length == 0
      sound = this.keytext
    keysynth.src = '/lettersound/' + sound + '.mp3'
    keysynth.currentTime = 0
    keysynth.play()
    this.fire 'key-typed', this
  #setClickCallback: (callback) ->
  #  console.log 'set click callback'
  #  this.clickcallback = callback
}
