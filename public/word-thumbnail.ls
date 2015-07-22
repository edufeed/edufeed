Polymer {
  is: 'word-thumbnail'
  properties: {
    word: {
      type: String
      value: ''
    }
    width: {
      type: Number
      value: 400
      observer: 'widthChanged'
    }
    height: {
      type: Number
      value: 200
    }
  }
  widthChanged: ->
    this.$$('#outerdiv').style.width = this.width + 'px'
    this.$$('#outerdiv').style.height = this.height + 'px'
    this.$$('#textdiv').style.width = this.width + 'px'
}
