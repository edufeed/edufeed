RegisterActivity {
  is: 'video-activity'
  properties: {
    videosrc: {
      type: String
      computed: 'computevideosrc(videoid)'
      observer: 'videosrc_changed'
    }
    videoid: {
      type: String
    }
  }
  computevideosrc: (videoid) ->
    return "videos/youtube/#{videoid}.mp4"
  activityVideoEnded: ->
    this.fire 'task-finished', this
  activityVideoError: (error) ->
    this.S('#activityvideo').hide()
    this.S('#activityvideo_alttext').text('error occurred while playing tutorial: ' + this.videosrc)
    this.S('#activityvideo_alttext').show()
    console.log error
  videosrc_changed: (videosrc) ->
    self = this
    fetchAsDataURL videosrc, (dataurl) ->
      self.$$('#activityvideo').src = dataurl
}