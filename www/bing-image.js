// Generated by LiveScript 1.3.1
(function(){
  Polymer({
    is: 'bing-image',
    properties: {
      query: {
        type: String,
        value: '',
        observer: 'queryChanged'
      },
      resultnum: {
        type: Number,
        value: 0,
        observer: 'resultnumChanged'
      },
      width: {
        type: String,
        value: 100,
        notify: true
      },
      height: {
        type: String,
        value: 100,
        notify: true
      },
      imgstyle: {
        type: String,
        value: '',
        observer: 'imgstyleChanged'
      }
    },
    queryChanged: function(newvalue, oldvalue){
      var self;
      if (newvalue === oldvalue) {
        return;
      }
      if (newvalue == null || newvalue === '') {
        this.$$('#imgtag').src = '/transparent.png';
        return;
      }
      self = this;
      return get_imagedata_by_name(newvalue, function(imgdata){
        if (self.query !== newvalue) {
          return;
        }
        return self.$$('#imgtag').src = imgdata;
      });
    },
    resultnumChanged: function(newvalue, oldvalue){
      if (newvalue === oldvalue || this.data == null) {
        return;
      }
      return this.$$('#imgtag').src = this.data[newvalue];
    },
    imgstyleChanged: function(){
      return applyStyleTo(this.$$('#imgtag'), this.imgstyle);
    }
  });
}).call(this);