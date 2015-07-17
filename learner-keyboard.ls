Polymer {
  is: 'learner-keyboard'
  properties: {
    keylines: {
      type: Array
      value: [
        [
          # row 1
          {text: 'a', width: 4, marginright: 0.5}
          {text: 'm', marginright: 0.5}
          'b'
          {text: 'p', marginright: 0.5}
          'f'
          'v'
          # {text: '←', sound: 'undo', special: 'backspace', marginleft: 1.0}
        ]
        [
          # row 2
          'e'
          {text: 'o', marginright: 0.5}
          {text: 'n', marginright: 0.5}
          'd'
          {text: 't', marginright: 0.5}
          's'
          'z'
        ]
        [
          # row 3
          'i'
          {text: 'u', marginright: 0.5}
          {text: 'l', marginright: 0.5}
          {text: 'g', sound: 'g_hard'}
          {text: 'c', sound: 'c_hard', marginright: 0.5}
          {text: 'c', sound: 'c_soft'}
          {text: 'g', sound: 'g_soft'}
        ]
        [
          # row 4
          'y'
          {text: 'w', marginright: 0.5}
          {text: 'r', marginright: 0.5}
          {text: 'q', width: 4/3}
          {text: 'x', width: 4/3}
          {text: 'k', width: 4/3, marginright: 0.5}
          'h'
          'j'
        ]
      ]
    }
    hidebackspace: {
      type: Boolean
      value: false
      observer: 'hiddenKeysChanged'
    }
    shownkeys: {
      type: String
      value: [\a to \z].join('')
      observer: 'hiddenKeysChanged'
    }
    #hiddenkeys: {
    #  type: String
    #  value: '' #[\a to \z].join('')
    #  observer: 'hiddenKeysChanged'
    #}
  }
  keyTyped: (evt, key) ->
    #console.log evt
    #console.log key
    #console.log key.keytext
    this.fire 'key-typed', key
    return
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
  */
  isKeySpecial: (key) ->
    if key.special == 'backspace'
      return 'backspace'
    return ''
  getKeyColor: (key) ->
    cvowel = 'yellow'
    csemivowel = '#FFA500' # orange
    cnasal = '#FF5533' # red
    cstop = '#77AAFF' # blue
    cstop_voiced = '#5577FF'
    cfricative = '#AAFFAA' # green
    cfricative_voiced = '#00FF00'
    cstop_voiced = cstop
    cfricative_voiced = cfricative
    keysound = key.sound
    key = this.getKeyText key
    if key == 'c' or key == 'g'
      return '#00FFFF'
    if keysound == 'g_hard'
      return cstop_voiced
    if keysound == 'c_hard'
      return cstop
    if keysound == 'c_soft'
      return cfricative
    if keysound == 'g_soft'
      return cfricative_voiced
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
  getKeySound: (key) ->
    if key.sound?
      return key.sound
    return ''
  getKeyText: (key) ->
    if typeof key == typeof ''
      return key
    else
      return key.text
  getKeyWidth: (key) ->
    if key.width?
      return key.width
    return 2
  getKeyHeight: (key) ->
    if key.height?
      return key.height
    return 2
  getKeyMarginLeft: (key) ->
    if key.marginleft?
      return key.marginleft
    return 0
  getKeyMarginRight: (key) ->
    if key.marginright?
      return key.marginright
    return 0
  getKeyMarginTop: (key) ->
    if key.margintop?
      return key.margintop
    return 0
  getKeyId: (key) ->
    key = this.getKeyText key
    return 'key' + key
  hiddenKeysChanged: (newvalue, oldvalue) ->
    for x in $(this).find('keyboard-button')
      x.ishidden = this.isKeyHidden(x.keytext)
    #for x in (newvalue + oldvalue).split('')
    #  curkey = this.$$('#key' + x)
    #  if curkey?
    #    curkey.ishidden = this.isKeyHidden(x)
    #    #curkey.visibilityChanged()
  #computeKeyLines: (keys) ->
  #  return keys.split(';')
  #computeKeysArray: (keys) ->
  #  return keys.split('')
  isKeyHidden: (key) ->
    key = this.getKeyText key
    if key == '←'
      return this.hidebackspace
    return this.shownkeys.indexOf(key) == -1
    #return this.hiddenkeys.indexOf(key) != -1
}
