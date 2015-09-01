RegisterActivity {
  is: 'tutorial-display'
  properties: {
    tutorial: {
      type: String
      value: 'sample'
    }
    videosrc: {
      type: String
      computed: 'compute_videosrc(tutorial)'
      observer: 'videosrc_changed'
    }
  }
  S: (pattern) ->
    return $(this.$$(pattern))
  videoEnded: ->
    this.fire 'close-tutorial', this
  videoError: (error) ->
    this.S('#tutorialvideo').hide()
    this.S('#tutorialvideo_alttext').text('error occurred while playing tutorial: ' + this.videosrc)
    this.S('#tutorialvideo_alttext').show()
    console.log error
  compute_videosrc: (tutorial) ->
    return "videos/#{tutorial}-tutorial.mp4"
  videosrc_changed: (videosrc) ->
    self = this
    fetchAsDataURL videosrc, (dataurl) ->
      self.$$('#tutorialvideo').src = dataurl
  closeTutorial: ->
    this.fire 'close-tutorial', this
}