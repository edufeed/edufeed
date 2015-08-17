RegisterActivity {
  is: 'dots-activity'
  properties: {
    numdots: {
      type: Number
      value: 5
    }
    targetformula: {
      type: String
      value: '_x_=_'
      observer: 'targetformulaChanged'
    }
  }
  S: (pattern) ->
    $(this.$$(pattern))
  targetformulaChanged: ->
    {task, term1, term2, product} = parseMultiplicationProblem(this.targetformula)
    this.task = task
    this.target_term1 = term1
    this.target_term2 = term2
    this.target_terms = [term1, term2]
    this.target_product = product
    this.S('#formuladisplay').prop {
      task: this.task
      term1: this.target_term1
      term2: this.target_term2
      product: this.target_product
    }
  finished: ->
    console.log 'done! task=' + this.task
    $('#dotsgrid').prop('ignoretouch', true)
    setInterval ~>
      this.fire 'task-finished', this
    , 2000
  selectedDotsChanged: (obj, data) ->
    {xdim, ydim} = data
    term1 = xdim
    term2 = ydim
    product = term1 * term2
    synthesize_word(product.toString())
    if this.task == ''
      this.S('#formuladisplay').prop {
        term1: term1
        term2: term2
        product: product
      }
    terms = [term1, term2]
    console.log this.target_terms
    console.log this.task
    console.log 'product:' + product
    console.log this.target_product
    if this.task == ''
      this.S('#formuladisplay')[0].animateProduct()
    if this.task == 'product'
      if product == this.target_product
        this.S('#formuladisplay')[0].showterm('product')
        this.S('#formuladisplay')[0].animateProduct()
        this.finished()
    if this.task == 'both_terms'
      if product == this.target_product
        this.S('#formuladisplay').prop {
          term1: term1
          term2: term2
        }
        this.S('#formuladisplay')[0].showterm('term1')
        this.S('#formuladisplay')[0].showterm('term2')
        this.finished()
    if this.task == 'first_term'
      if product == this.target_product and (this.target_terms.indexOf(term1) != -1 or this.target_terms.indexOf(term2) != -1)
        this.S('#formuladisplay')[0].showterm('term1')
        this.finished()
    if this.task == 'second_term'
      if product == this.target_product and (this.target_terms.indexOf(term1) != -1 or this.target_terms.indexOf(term2) != -1)
        this.S('#formuladisplay')[0].showterm('term2')
        this.finished()
  ready: ->
    width = Math.min $(window).height(), $(window).width()
    this.S('#dotsgrid').prop 'width', width
}