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
  ready: ->
    self = this
    this.addEventListener 'show-poster-thumbnail', ->
      self.$$('#posterontop').style.display = 'in-line'
      #self.$$('#thumbnailwrapper').style.display = 'none'
    this.addEventListener 'hide-poster-thumbnail', ->
      self.$$('#posterontop').style.display = 'none'
      #self.$$('#thumbnailwrapper').style.display = 'in-line'
    posterthumbnailshown <- getBoolParam('showposterthumbnail')
    if posterthumbnailshown
      self.$$('#posterontop').style.display = 'in-line'
      #self.$$('#thumbnailwrapper').style.display = 'none'
    else
      self.$$('#posterontop').style.display = 'none'
      #self.$$('#thumbnailwrapper').style.display = 'in-line'
}
