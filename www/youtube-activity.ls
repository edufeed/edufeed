RegisterActivity {
  is: 'youtube-activity'
  properties: {
    #videosrc: {
    #  type: String
    #  value: ''
    #}
    videoid: {
      type: String
      #computed: 'computevideoid(videosrc)'
    }
  }
  youtubeVideoStateChanged: (newstate) ->
    console.log 'videoStateChanged: '
    console.log newstate
    if newstate? and newstate.detail? and newstate.detail.data? and newstate.detail.data == 0
      this.fire 'task-finished', this
  #computevideoid: (videosrc) ->
  #  return videosrc.split('http://www.youtube.com/embed/').join('')
  /*
  S: (pattern) ->
    $(this.$$(pattern))
  ready: ->
    this.S('#hoverspan').hover ->
      $(this).css 'background-color', 'yellow'
  showAlert: ->
    alert 'button has been clicked'
  finishTask: ->
    this.fire 'task-finished', this
  */
}