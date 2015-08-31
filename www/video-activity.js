(function(){
  RegisterActivity({
    is: 'video-activity',
    properties: {
      videoid: {
        type: String
      }
    },
    youtubeVideoStateChanged: function(newstate){
      console.log('videoStateChanged: ');
      console.log(newstate);
      if (newstate != null && newstate.detail != null && newstate.detail.data != null && newstate.detail.data === 0) {
        return this.fire('task-finished', this);
      }
    }
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
  });
}).call(this);
