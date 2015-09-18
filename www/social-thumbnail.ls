Polymer {
  is: 'social-thumbnail'
  properties: {
    poster: {
      type: String
      value: ''
      #notify: true
    }
    finishedby: {
      type: Array
      value: []
      #notify: true
    }
    myname: {
      type: String
      value: ''
    }
    finished: {
      type: Boolean
      computed: 'compute_finished(finishedby, myname)'
      observer: 'finished_changed'
    }
    posterthumbnail: {
      type: Boolean
      observer: 'posterthumbnail_changed'
    }
  }
  compute_finished: (finishedby, myname) ->
    if not finishedby? or not myname?
      return false
    return finishedby.indexOf(myname) >= 0
  finished_changed: (finished) ->
    if finished
      this.$$('#doneicon').style.display = 'inline'
    else
      this.$$('#doneicon').style.display = 'none'
  posterthumbnail_changed: (changed) ->
    if changed
      this.$$('#posterbelow').hide()
      this.$$('#posterontop').show()
      this.$$('thumbnailwrapper').hide()
    else
      this.$$('#posterbelow').show()
      this.$$('#posterontop').hide()
      this.$$('#thumbnailwrapper').hide()
  ready: ->
    self = this
    this.addEventListener 'poster-on-top', ->
      self.$$('#posterontop').style.display = 'in-line'
      #self.S('#posterbelow').hide()
      #self.S('#posterontop').show()
      #self.S('#thumbnailwrapper').hide()
    this.addEventListener 'poster-below', ->
      self.$$('#posterbelow').style.display = 'in-line'
      #self.S('#posterbelow').show()
      #self.S('#posterontop').hide()
      #self.S('#thumbnailwrapper').show()
    posterthumbnailshown <- getBoolParam('showposterthumbnail')
    if posterthumbnailshown
      self.$$('#posterontop').style.display = 'in-line'
      #self.$$('#posterbelow').style.display = 'none'
    else
      self.$$('#posterontop').style.display = 'none'
      #self.$$('#posterbelow').style.display = 'in-line'
}
