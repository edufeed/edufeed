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
    if this.task == ''
      setTimeout ~>
        this.fire 'task-freeplay', this
      , 0
    else
      setTimeout ~>
        this.fire 'task-notfreeplay', this
      , 0
    this.S('#formuladisplay').prop {
      task: this.task
      term1: this.target_term1
      term2: this.target_term2
      product: this.target_product
    }
  finished: ->
    if this.finished_fired? and this.finished_fired
      return
    this.finished_fired = true
    $('#dotsgrid').prop('ignoretouch', true)
    play_success_sound ~>
      this.fire 'task-finished', this
  updateFormula: (term1, term2, is_released) ->
    if not is_released?
      is_released = false
    product = term1 * term2
    if not is_released
      synthesize_word(product.toString())
    if this.task == ''
      this.S('#formuladisplay').prop {
        term1: term1
        term2: term2
        product: product
      }
    terms = [term1, term2]
    if this.task == ''
      this.S('#formuladisplay')[0].animateProduct()
    if this.task == 'product'
      if product == this.target_product
        this.S('#formuladisplay')[0].showterm('product')
        this.S('#formuladisplay')[0].animateProduct()
        if is_released
          this.finished()
    if this.task == 'both_terms'
      if product == this.target_product
        this.S('#formuladisplay').prop {
          term1: term1
          term2: term2
        }
        this.S('#formuladisplay')[0].showterm('term1')
        this.S('#formuladisplay')[0].showterm('term2')
        if is_released
          this.finished()
    if this.task == 'first_term'
      if product == this.target_product and (this.target_terms.indexOf(term1) != -1 or this.target_terms.indexOf(term2) != -1)
        this.S('#formuladisplay')[0].showterm('term1')
        if is_released
          this.finished()
    if this.task == 'second_term'
      if product == this.target_product and (this.target_terms.indexOf(term1) != -1 or this.target_terms.indexOf(term2) != -1)
        this.S('#formuladisplay')[0].showterm('term2')
        if is_released
          this.finished()
  selectedDotsChanged: (obj, data) ->
    if not data?
      return
    {xdim, ydim} = data
    if not xdim? or not ydim?
      return
    this.updateFormula(xdim, ydim, false)
  pointerReleasedDimensions: (obj, data) ->
    if not data?
      return
    {xdim, ydim} = data
    if not xdim? or not ydim?
      return
    this.updateFormula(xdim, ydim, true)
  ready: ->
    width = Math.min $(window).height(), $(window).width()
    this.S('#dotsgrid').prop 'width', width
}