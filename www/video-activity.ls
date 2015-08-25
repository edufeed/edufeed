RegisterActivity {
  is: 'video-activity'
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