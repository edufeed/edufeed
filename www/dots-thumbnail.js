(function(){
  RegisterThumbnail({
    is: 'dots-thumbnail',
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
      var ref$, task, term1, term2, product;
      ref$ = parseMultiplicationProblem(this.targetformula), task = ref$.task, term1 = ref$.term1, term2 = ref$.term2, product = ref$.product;
      if (task === '') {
        this.S('#thumbnailmultiplyformula').hide();
        this.S('#thumbnailmultiplyformulabackground').hide();
        return;
      }
      this.S('#thumbnailmultiplyformula').show();
      this.S('#thumbnailmultiplyformulabackground').show();
      return this.S('#thumbnailmultiplyformula').prop({
        task: task,
        term1: term1,
        term2: term2,
        product: product
      });
    }
  });
}).call(this);
