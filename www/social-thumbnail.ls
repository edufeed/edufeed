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
  getBubblesList: ->
    bubbles = [
      'bubble.svg'
      'bubble-red.svg'
      'bubble-orange.svg'
      'bubble-yellow.svg'
      'bubble-green.svg'
      'bubble-blue.svg'
      'bubble-purple.svg'
    ]
    return bubbles
  chooseRandomBubbleColor: ->
    bubbles = this.getBubblesList()
    randomBubble = bubbles[Math.floor(Math.random() * bubbles.length)]
    return randomBubble
  ready: ->
    self = this
    posterthumbnailshown <- getBoolParam('showposterthumbnail')
    if posterthumbnailshown
      self.$$('#posterontop').style.display = 'inline'
      self.$$('#thumbnailwrapper').style.opacity = 0.0
      self.$$('#posterbelow').style.display = 'none'
      if self.$$('#calloutbubble').style.display != 'none'
        self.$$('#bubble').src = self.chooseRandomBubbleColor()
      self.$$('#calloutbubble').style.display = 'none'
      self.$$('#bubble').style.display = 'inline'
    else
      self.$$('#posterontop').style.display = 'none'
      self.$$('#thumbnailwrapper').style.opacity = 1.0
      self.$$('#posterbelow').style.display = 'inline'
      self.$$('#calloutbubble').style.display = 'inline'
      self.$$('#bubble').style.display = 'none'
}
