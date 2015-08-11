Polymer {
  is: 'multiply-formula-display'
  properties: {
    term1: {
      type: Number
      value: 0
      #observer: 'termsChanged'
      notify: true
    }
    term2: {
      type: Number
      value: 0
      #observer: 'termsChanged'
      notify: true
    }
    product: {
      type: Number
      value: 0
      #computed: 'computeProduct(term1, term2)'
      observer: 'productChanged'
    }
    task: {
      type: String
      value: ''
      observer: 'taskChanged'
    }
  }
  S: (pattern) ->
    $(this.$$(pattern))
  taskChanged: ->
    task = this.task
    if task == 'product'
      this.S('#productnum').css {
        color: 'white'
        border-width: '2px'
      }
    if task == 'first_term'
      this.S('#term1num').css {
        color: 'white'
        border-width: '2px'
      }
    if task == 'second_term'
      this.S('#term2num').css {
        color: 'white'
        border-width: '2px'
      }
    if task == 'both_terms'
      this.S('#term1num').css {
        color: 'white'
        border-width: '2px'
      }
      this.S('#term2num').css {
        color: 'white'
        border-width: '2px'
      }
  termToStr: (term) ->
    str = term.toString()
    if str.length == 1
      return ' ' + str #String.fromCharCode(12288) + str
    return str
  #computeProduct: (term1, term2) ->
  #  return term1 * term2
  productChanged: ->
    if this.product == 0
      return
    self = this
    #if this.task == ''
    #  this.animateProduct()
  animateProduct: ->
      this.S('#productbackground').stop(true, true)
      this.S('#productbackground').css('opacity', '1')
      this.S('#productbackground').animate({
        'opacity': 0
      }, 800)
  showterm: (term) ->
    if term == 'product'
      this.S('#productnum').css 'color', this.S('#product').css('color')
    if term == 'term1'
      this.S('#term1num').css 'color', this.S('#term1').css('color')
    if term == 'term2'
      this.S('#term2num').css 'color', this.S('#term2').css('color')
}