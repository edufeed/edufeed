(function(){
  Polymer({
    is: 'multiply-formula-display',
    properties: {
      term1: {
        type: Number,
        value: 0,
        notify: true
      },
      term2: {
        type: Number,
        value: 0,
        notify: true
      },
      product: {
        type: Number,
        value: 0,
        observer: 'productChanged'
      },
      task: {
        type: String,
        value: '',
        observer: 'taskChanged'
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    taskChanged: function(){
      var task;
      task = this.task;
      if (task === 'product') {
        this.S('#productnum').css({
          color: 'white',
          borderWidth: '2px'
        });
      }
      if (task === 'first_term') {
        this.S('#term1num').css({
          color: 'white',
          borderWidth: '2px'
        });
      }
      if (task === 'second_term') {
        this.S('#term2num').css({
          color: 'white',
          borderWidth: '2px'
        });
      }
      if (task === 'both_terms') {
        this.S('#term1num').css({
          color: 'white',
          borderWidth: '2px'
        });
        return this.S('#term2num').css({
          color: 'white',
          borderWidth: '2px'
        });
      }
    },
    termToStr: function(term){
      var str;
      str = term.toString();
      if (str.length === 1) {
        return ' ' + str;
      }
      return str;
    },
    productChanged: function(){
      var self;
      if (this.product === 0) {
        return;
      }
      return self = this;
    },
    animateProduct: function(){
      this.S('#productbackground').stop(true, true);
      this.S('#productbackground').css('opacity', '1');
      return this.S('#productbackground').animate({
        'opacity': 0
      }, 800);
    },
    showterm: function(term){
      if (term === 'product') {
        this.S('#productnum').css('color', this.S('#product').css('color'));
      }
      if (term === 'term1') {
        this.S('#term1num').css('color', this.S('#term1').css('color'));
      }
      if (term === 'term2') {
        return this.S('#term2num').css('color', this.S('#term2').css('color'));
      }
    }
  });
}).call(this);
