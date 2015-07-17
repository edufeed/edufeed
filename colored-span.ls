Polymer {
  is: 'colored-span'
  properties: {
    word: {
      type: String
      value: 'dog'
      observer: 'wordChanged'
    }
    highlightidx: {
      type: Number
      value: -1
      observer: 'highlightidxChanged'
    }
  }
  wordToArray: (x) ->
    return x.split('')
  wordChanged: ->
    return
  indexToId: (index) ->
    return 'item' + index
  highlightidxChanged: (index) ->
    for index in [0 til this.word.length]
      item = this.$$('#' + this.indexToId(index))
      if item?
        item.highlighted = this.isHighlighted(index)
    #highlighted = this.$$('#' + this.indexToId(index))
    #if not highlighted?
    #  return
    #highlighted.style.backgroundColor = 'yellow'
  isHighlighted: (index) ->
    if index == this.highlightidx
      return true
    return false
}
