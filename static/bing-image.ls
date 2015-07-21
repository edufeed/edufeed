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
  }
  #ready: ->
  #  this.data = []
  queryChanged: (newvalue, oldvalue) ->
    if newvalue == oldvalue
      return
    if not newvalue? or newvalue == ''
      return
    self = this
    $.getJSON '/image?' + $.param({name: newvalue}), (data) ->
      self.data = data
      #console.log 'queryChanged:' + 'query=' + self.query + 'newsrc=' + self.data[self.resultnum]
      self.$$('img').src = self.data[self.resultnum]
  resultnumChanged: (newvalue, oldvalue) ->
    if newvalue == oldvalue or not this.data?
      return
    #console.log 'resultnumChanged:' + 'query=' + this.query + 'newsrc=' + this.data[newvalue]
    this.$$('img').src = this.data[newvalue]
}
