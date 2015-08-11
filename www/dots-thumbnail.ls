RegisterThumbnail {
  is: 'dots-thumbnail'
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
    if task == ''
      this.S('#thumbnailmultiplyformula').hide()
      this.S('#thumbnailmultiplyformulabackground').hide()
      return
    this.S('#thumbnailmultiplyformula').show()
    this.S('#thumbnailmultiplyformulabackground').show()
    this.S('#thumbnailmultiplyformula').prop {task, term1, term2, product}
}
