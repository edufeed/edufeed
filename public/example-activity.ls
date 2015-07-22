Polymer {
  is: 'example-activity'
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
  S: (pattern) ->
    $(this.$$(pattern))
  ready: ->
    this.S('#hoverspan').hover ->
      $(this).css 'background-color', 'yellow'
  showAlert: ->
    alert 'button has been clicked'
  finishTask: ->
    this.fire 'task-finished', this
}