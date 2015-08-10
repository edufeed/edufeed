RegisterThumbnail {
  is: 'dots-thumbnail'
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
    this.S('#thumbnaildotsgrid').prop 'numdots', this.numdots
}
