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
    imgsrc: {
      type: String
      value: ''
      observer: 'imgsrcChanged'
    }
    imgstyle: {
      type: String
      value: ''
      observer: 'imgstyleChanged'
    }
  }
  imgsrcChanged: (newvalue, oldvalue) ->
    if newvalue == oldvalue
      return
    if not newvalue? or newvalue == ''
      return
    this.$$('#imgtag').src = newvalue
  #ready: ->
  #  this.data = []
  queryChanged: (newvalue, oldvalue) ->
    if newvalue == oldvalue
      return
    if not newvalue? or newvalue == ''
      this.$$('#imgtag').src = '/transparent.png'
      return
    self = this
    get_image_paths (image_paths) ->
      if self.query != newvalue # query property has changed!
        return
      if image_paths[newvalue]?
        self.$$('#imgtag').src = image_paths[newvalue]
        return
      get_imagedata_by_name newvalue, (imgdata) ->
        if self.query != newvalue # query property has changed!
          return
        self.$$('#imgtag').src = imgdata
    /*
    $.getJSON '/image?' + $.param({name: newvalue}), (data) ->
      if self.query != newvalue # query property has changed!
        return
      self.data = data
      #console.log 'queryChanged:' + 'query=' + self.query + 'newsrc=' + self.data[self.resultnum]
      $.get '/proxybase64?' + $.param({url: self.data[self.resultnum]}), (imgdata) ->
        if self.query != newvalue # query property has changed!
          return
        self.$$('#imgtag').src = imgdata
    */
  resultnumChanged: (newvalue, oldvalue) ->
    if newvalue == oldvalue or not this.data?
      return
    #console.log 'resultnumChanged:' + 'query=' + this.query + 'newsrc=' + this.data[newvalue]
    this.$$('#imgtag').src = this.data[newvalue]
  imgstyleChanged: ->
    applyStyleTo this.$$('#imgtag'), this.imgstyle
}
