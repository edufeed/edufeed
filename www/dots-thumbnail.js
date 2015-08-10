(function(){
  RegisterThumbnail({
    is: 'dots-thumbnail',
    properties: {
      numdots: {
        type: Number,
        value: 5,
        observer: 'numdotsChanged'
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    numdotsChanged: function(){
      return this.S('#thumbnaildotsgrid').prop('numdots', this.numdots);
    }
  });
}).call(this);
