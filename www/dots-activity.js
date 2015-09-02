(function(){
  RegisterActivity({
    is: 'dots-activity',
    properties: {
      numdots: {
        type: Number,
        value: 5
      },
      targetformula: {
        type: String,
        value: '_x_=_',
        observer: 'targetformulaChanged'
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    targetformulaChanged: function(){
      var ref$, task, term1, term2, product, this$ = this;
      ref$ = parseMultiplicationProblem(this.targetformula), task = ref$.task, term1 = ref$.term1, term2 = ref$.term2, product = ref$.product;
      this.task = task;
      this.target_term1 = term1;
      this.target_term2 = term2;
      this.target_terms = [term1, term2];
      this.target_product = product;
      if (this.task === '') {
        setTimeout(function(){
          return this$.fire('task-freeplay', this$);
        }, 0);
      } else {
        setTimeout(function(){
          return this$.fire('task-notfreeplay', this$);
        }, 0);
      }
      return this.S('#formuladisplay').prop({
        task: this.task,
        term1: this.target_term1,
        term2: this.target_term2,
        product: this.target_product
      });
    },
    finished: function(){
      var this$ = this;
      if (this.finished_fired != null && this.finished_fired) {
        return;
      }
      this.finished_fired = true;
      $('#dotsgrid').prop('ignoretouch', true);
      return play_success_sound(function(){
        return this$.fire('task-finished', this$);
      });
    },
    updateFormula: function(term1, term2, is_released){
      var product, terms;
      if (is_released == null) {
        is_released = false;
      }
      product = term1 * term2;
      if (!is_released) {
        synthesize_word(product.toString());
      }
      if (this.task === '') {
        this.S('#formuladisplay').prop({
          term1: term1,
          term2: term2,
          product: product
        });
      }
      terms = [term1, term2];
      console.log(this.target_terms);
      console.log(this.task);
      console.log('product:' + product);
      console.log(this.target_product);
      if (this.task === '') {
        this.S('#formuladisplay')[0].animateProduct();
      }
      if (this.task === 'product') {
        if (product === this.target_product) {
          this.S('#formuladisplay')[0].showterm('product');
          this.S('#formuladisplay')[0].animateProduct();
          if (is_released) {
            this.finished();
          }
        }
      }
      if (this.task === 'both_terms') {
        if (product === this.target_product) {
          this.S('#formuladisplay').prop({
            term1: term1,
            term2: term2
          });
          this.S('#formuladisplay')[0].showterm('term1');
          this.S('#formuladisplay')[0].showterm('term2');
          if (is_released) {
            this.finished();
          }
        }
      }
      if (this.task === 'first_term') {
        if (product === this.target_product && (this.target_terms.indexOf(term1) !== -1 || this.target_terms.indexOf(term2) !== -1)) {
          this.S('#formuladisplay')[0].showterm('term1');
          if (is_released) {
            this.finished();
          }
        }
      }
      if (this.task === 'second_term') {
        if (product === this.target_product && (this.target_terms.indexOf(term1) !== -1 || this.target_terms.indexOf(term2) !== -1)) {
          this.S('#formuladisplay')[0].showterm('term2');
          if (is_released) {
            return this.finished();
          }
        }
      }
    },
    selectedDotsChanged: function(obj, data){
      var xdim, ydim;
      if (data == null) {
        return;
      }
      xdim = data.xdim, ydim = data.ydim;
      if (xdim == null || ydim == null) {
        return;
      }
      console.log('selectedDotsChanged');
      console.log(data);
      return this.updateFormula(xdim, ydim, false);
    },
    pointerReleasedDimensions: function(obj, data){
      var xdim, ydim;
      if (data == null) {
        return;
      }
      xdim = data.xdim, ydim = data.ydim;
      if (xdim == null || ydim == null) {
        return;
      }
      return this.updateFormula(xdim, ydim, true);
    },
    ready: function(){
      var width;
      width = Math.min($(window).height(), $(window).width());
      return this.S('#dotsgrid').prop('width', width);
    }
  });
}).call(this);
