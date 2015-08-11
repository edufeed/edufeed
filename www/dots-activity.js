(function(){
  RegisterActivity({
    is: 'dots-activity',
    properties: {
      numdots: {
        type: Number,
        value: 5,
        observer: 'numdotsChanged'
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
    numdotsChanged: function(){
      return this.S('#dotsgrid').prop('numdots', this.numdots);
    },
    targetformulaChanged: function(){
      var numvars;
      numvars = this.targetformula.split('_').length - 1;
      this.target_product = parseInt(
      this.targetformula.split('=')[1]);
      this.target_terms = this.targetformula.split('=')[0].split('x').map(function(x){
        return parseInt(x);
      });
      this.target_term1 = this.target_terms[0];
      this.target_term2 = this.target_terms[1];
      if (numvars === 2) {
        this.task = 'both_terms';
        this.target_term1 = this.target_term2 = 0;
      } else if (numvars === 1) {
        if (!isFinite(this.target_product)) {
          this.task = 'product';
          this.target_product = this.target_term1 * this.target_term2;
        } else if (!isFinite(this.target_term1)) {
          this.task = 'first_term';
          this.target_term1 = Math.round(this.target_product / this.target_term2);
        } else if (!isFinite(this.target_term2)) {
          this.task = 'second_term';
          this.target_term2 = Math.round(this.target_product / this.target_term1);
        }
      } else {
        this.task = '';
        this.target_product = 0;
        this.target_term1 = 0;
        this.target_term2 = 0;
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
      console.log('done! task=' + this.task);
      $('#dotsgrid').prop('ignoretouch', true);
      return setInterval(function(){
        return this$.fire('task-finished', this$);
      }, 2000);
    },
    selectedDotsChanged: function(obj, data){
      var xdim, ydim, term1, term2, product, terms;
      xdim = data.xdim, ydim = data.ydim;
      term1 = xdim;
      term2 = ydim;
      product = term1 * term2;
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
          this.finished();
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
          this.finished();
        }
      }
      if (this.task === 'second_term') {
        if (product === this.target_product && (this.target_terms.indexOf(term1) !== -1 || this.target_terms.indexOf(term2) !== -1)) {
          this.S('#formuladisplay')[0].showterm('term2');
          return this.finished();
        }
      }
    },
    ready: function(){
      var width;
      width = Math.min($(window).height(), $(window).width());
      this.S('#dotsgrid').prop('width', width);
      return this.numdotsChanged();
    }
  });
}).call(this);
