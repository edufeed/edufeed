(function(){
  RegisterActivity({
    is: 'tutorial-display',
    properties: {
      tutorial: {
        type: String,
        value: 'sample'
      },
      videosrc: {
        type: String,
        computed: 'compute_videosrc(tutorial)'
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    videoEnded: function(){
      return this.fire('close-tutorial', this);
    },
    videoError: function(error){
      this.S('#tutorialvideo').hide();
      this.S('#tutorialvideo_alttext').text('error occurred while playing tutorial: ' + this.videosrc);
      return this.S('#tutorialvideo_alttext').show();
    },
    compute_videosrc: function(tutorial){
      return "videos/" + tutorial + "-tutorial.mp4";
    },
    closeTutorial: function(){
      return this.fire('close-tutorial', this);
    }
  });
}).call(this);
