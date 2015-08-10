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
      computed: 'computeProduct(term1, term2)'
      observer: 'productChanged'
    }
  }
  S: (pattern) ->
    $(this.$$(pattern))
  computeProduct: (term1, term2) ->
    return term1 * term2
  productChanged: ->
    if this.product == 0
      return
    this.S('#productbackground').stop(true, true)
    this.S('#productbackground').css('opacity', '1')
    this.S('#productbackground').animate({
      'opacity': 0
    }, 800)
}