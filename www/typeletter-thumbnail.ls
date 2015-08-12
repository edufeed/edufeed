RegisterThumbnail {
  is: 'typeletter-thumbnail'
  properties: {
    word: {
      type: String
      value: ''
    }
    width: {
      type: Number
      value: 350
      observer: 'widthChanged'
    }
    height: {
      type: Number
      value: 350
    }
    letter: {
      type: String
      computed: 'getFirstLetter(word)'
    }
  }
  getFirstLetter: (word) ->
    return word[0]
  widthChanged: ->
    this.$$('#outerdiv').style.width = this.width + 'px'
    this.$$('#outerdiv').style.height = this.height + 'px'
    this.$$('#textdiv').style.width = this.width + 'px'
}
