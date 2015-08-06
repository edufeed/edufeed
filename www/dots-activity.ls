RegisterActivity {
  is: 'dots-activity'
  /*
  properties: {
    foo: {
      type: String
      value: ''
    }
    bar: {
      type: String
      value: ''
    }
  }
  */
  S: (pattern) ->
    $(this.$$(pattern))
  ready: ->
    /*
    this.S('#contents').on 'pointerdown', (evt) ->
      console.log 'pointerdown'
      console.log evt
    this.S('#contents').on 'pointermove', (evt) ->
      console.log 'pointermove'
      console.log evt
    */
    console.log 'activity started'
    # hammer = new Hammer(this.$$('#contents'))
}