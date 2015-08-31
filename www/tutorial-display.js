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
        computed: 'compute_videosrc(tutorial)',
        observer: 'videosrc_changed'
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
      this.S('#tutorialvideo_alttext').show();
      return console.log(error);
    },
    compute_videosrc: function(tutorial){
      return "videos/" + tutorial + "-tutorial.mp4";
    },
    videosrc_changed: function(videosrc){
      var self;
      self = this;
      return fetchAsDataURL(videosrc, function(dataurl){
        return self.$$('#tutorialvideo').src = dataurl;
      });
    },
    closeTutorial: function(){
      return this.fire('close-tutorial', this);
    }
  });
}).call(this);
