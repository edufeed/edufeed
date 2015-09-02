(function(){
  RegisterThumbnail({
    is: 'video-thumbnail',
    properties: {
      videoid: {
        type: String
      },
      thumbnailsrc: {
        type: String,
        computed: 'compute_thumbnailsrc(videoid)'
      }
    },
    compute_thumbnailsrc: function(videoid){
      return "videos/youtube_thumbnails/" + videoid + ".png";
    }
  });
}).call(this);
