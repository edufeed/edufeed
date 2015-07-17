Polymer {
  is: 'latin-keyboard'
  properties: {
    keys: {
      type: String
      value: [\a to \z].join('')
    }
    hiddenkeys: {
      type: String
      value: ''
      observer: 'hiddenKeysChanged'
    }
  }
  getKeyId: (key) ->
    return 'key' + key
  hiddenKeysChanged: (newvalue, oldvalue) ->
    for x in $(this).find('keyboard-button')
      x.ishidden = this.isKeyHidden(x.keytext)
    #for x in (newvalue + oldvalue).split('')
    #  curkey = this.$$('#key' + x)
    #  if curkey?
    #    curkey.ishidden = this.isKeyHidden(x)
    #    #curkey.visibilityChanged()
  computeKeysArray: (keys) ->
    return keys.split('')
  isKeyHidden: (key) ->
    return this.hiddenkeys.indexOf(key) != -1
}
