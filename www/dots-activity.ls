RegisterActivity {
  is: 'dots-activity'
  properties: {
    numdots: {
      type: Number
      value: 5
      observer: 'numdotsChanged'
    }
  }
  S: (pattern) ->
    $(this.$$(pattern))
  numdotsChanged: ->
    this.S('#dotsgrid').prop 'numdots', this.numdots
  selectedDotsChanged: (obj, data) ->
    {xdim, ydim} = data
    console.log data
    this.S('#formuladisplay').prop {
      term1: xdim
      term2: ydim
    }
  ready: ->
    width = Math.min $(window).height(), $(window).width()
    this.S('#dotsgrid').prop 'width', width
    this.numdotsChanged()
}