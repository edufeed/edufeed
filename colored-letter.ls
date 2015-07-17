Polymer {
  is: 'colored-letter'
  properties: {
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
  }
  getHighlightColor: ->
    key = this.letter
    if [\a to \z].indexOf(key) == -1
      return 'white'
    cvowel = 'yellow'
    csemivowel = '#FFA500' # orange
    cnasal = '#FF5533' # red
    cstop = '#77AAFF' # blue
    cstop_voiced = '#5577FF'
    cfricative = '#AAFFAA' # green
    cfricative_voiced = '#00FF00'
    cstop_voiced = cstop
    cfricative_voiced = cfricative
    if key == 'c' or key == 'g'
      return '#00FFFF'
    if 'yw'.indexOf(key) != -1
      return csemivowel
    if 'aeoiuyw'.indexOf(key) != -1
      return cvowel
    if 'mnlr'.indexOf(key) != -1
      return cnasal
    if 'bdg'.indexOf(key) != -1
      return cstop_voiced
    if 'bpdtgkqxc'.indexOf(key) != -1
      return cstop
    if 'vzjg'.indexOf(key) != -1
      return cfricative_voiced
    if 'fvszcjhg'.indexOf(key) != -1
      return cfricative
  letterChanged: ->
    highlight_color = this.getHighlightColor()
    console.log 'highlight color is ' + highlight_color
    if not this.highlighted
      highlight_color = 'white'
    this.style.backgroundColor = highlight_color
}
