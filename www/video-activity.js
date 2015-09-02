(function(){
  RegisterActivity({
    is: 'video-activity',
    properties: {
      videosrc: {
        type: String,
        computed: 'computevideosrc(videoid)',
        observer: 'videosrc_changed'
      },
      videoid: {
        type: String
      }
    },
    computevideosrc: function(videoid){
      return "videos/youtube/" + videoid + ".mp4";
    },
    activityVideoEnded: function(){
      return this.fire('task-finished', this);
    },
    activityVideoError: function(error){
      this.S('#activityvideo').hide();
      this.S('#activityvideo_alttext').text('error occurred while playing tutorial: ' + this.videosrc);
      this.S('#activityvideo_alttext').show();
      return console.log(error);
    },
    videosrc_changed: function(videosrc){
      return this.$$('#activityvideo').src = fixMediaURL(videosrc);
    }
  });
}).call(this);
