Polymer {
  is: 'colored-block-text'
  properties: {
    word: {
      type: String
      value: 'dog'
      observer: 'wordChanged'
    }
  }
  wordToArray: (x) ->
    return x.split('')
  wordChanged: ->
    return
}
