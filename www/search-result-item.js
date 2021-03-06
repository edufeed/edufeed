(function(){
  Polymer({
    is: 'search-result-item',
    properties: {
      query: {
        type: String,
        value: '',
        notify: true
      }
    },
    sayWord: function(){
      return this.$$('voice-player').speak();
    },
    openLesson: function(){
      return window.open('/studyword.html?' + $.param({
        lang: 'en',
        word: this.query
      }));
    }
  });
}).call(this);
