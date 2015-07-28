Polymer {
  is: 'bing-image'
  properties: {
    query: {
      type: String
      value: ''
      observer: 'queryChanged'
    }
    resultnum: {
      type: Number
      value: 0
      observer: 'resultnumChanged'
    }
    width: {
      type: String
      value: 100
      notify: true
    }
    height: {
      type: String
      value: 100
      notify: true
    }
    imgstyle: {
      type: String
      value: ''
      observer: 'imgstyleChanged'
    }
  }
  #ready: ->
  #  this.data = []
  queryChanged: (newvalue, oldvalue) ->
    if newvalue == oldvalue
      return
    if not newvalue? or newvalue == ''
      this.$$('#imgtag').src = '/transparent.png'
      return
    self = this
    $.getJSON '/image?' + $.param({name: newvalue}), (data) ->
      if self.query != newvalue # query property has changed!
        return
      self.data = data
      #console.log 'queryChanged:' + 'query=' + self.query + 'newsrc=' + self.data[self.resultnum]
      self.$$('#imgtag').src = self.data[self.resultnum]
  resultnumChanged: (newvalue, oldvalue) ->
    if newvalue == oldvalue or not this.data?
      return
    #console.log 'resultnumChanged:' + 'query=' + this.query + 'newsrc=' + this.data[newvalue]
    this.$$('#imgtag').src = this.data[newvalue]
  imgstyleChanged: ->
    applyStyleTo this.$$('#imgtag'), this.imgstyle
}
