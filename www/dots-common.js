(function(){
  var parseMultiplicationProblem, out$ = typeof exports != 'undefined' && exports || this;
  out$.parseMultiplicationProblem = parseMultiplicationProblem = function(targetformula){
    var numvars, product, terms, term1, term2, task;
    numvars = targetformula.split('_').length - 1;
    product = parseInt(
    targetformula.split('=')[1]);
    terms = targetformula.split('=')[0].split('x').map(function(x){
      return parseInt(x);
    });
    term1 = terms[0];
    term2 = terms[1];
    if (numvars === 2) {
      task = 'both_terms';
      term1 = term2 = 0;
    } else if (numvars === 1) {
      if (!isFinite(product)) {
        task = 'product';
        product = term1 * term2;
      } else if (!isFinite(term1)) {
        task = 'first_term';
        term1 = Math.round(product / term2);
      } else if (!isFinite(term2)) {
        task = 'second_term';
        term2 = Math.round(product / term1);
      }
    } else {
      task = '';
      product = 0;
      term1 = 0;
      term2 = 0;
    }
    return {
      task: task,
      term1: term1,
      term2: term2,
      product: product
    };
  };
}).call(this);
