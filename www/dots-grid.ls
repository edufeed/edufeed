Polymer {
  is: 'dots-grid'
  properties: {
    numdots: {
      type: Number
      value: 5
      observer: 'createDots'
    }
    width: {
      type: Number
      value: 500
      observer: 'createDots'
    }
  }
  S: (pattern) ->
    $(this.$$(pattern))
  hideSelectionRectangle: ->
    this.S('#selection').hide()
  selectionRectangle: (startx, starty, endx, endy) ->
    selection = this.S('#selection')
    if selection.length == 0
      selection = $('<div>').prop('id', 'selection')
      selection.appendTo this
    selection.show()
    selection.offset({left: startx, top: starty})
    selection.css({width: endx - startx, height: endy - starty})
  createDots: ->
    #this.S('.colordot').remove()
    $(this).find('.colordot').remove()
    numdots = this.numdots
    width = this.width
    spacing = width / numdots
    for i in [0 til numdots]
      for j in [0 til numdots]
        newdot = $('<div>')
        newdot.css({
          width: '10px'
          height: '10px'
          'background-color': 'black'
          'border-radius': '50%'
          position: 'absolute'
          top: Math.round(spacing * (i + 0.5)) + 'px'
          left: Math.round(spacing * (j + 0.5)) + 'px'
          'pointer-events': 'noner'
        })
        newdot.addClass('colordot')
        newdot.appendTo this
  ready: ->
    /*
    this.S('#contents').on 'touchy-drag', (evt) ->
      console.log evt
    */
    self = this
    $(this).on 'pointerdown', (evt) ->
      self.drawing = true
      self.startx = evt.offsetX
      self.starty = evt.offsetY
      #console.log 'pointerdown'
      #console.log evt
    $(this).on 'pointermove', (evt) ->
      if self.drawing
        diffx = self.startx - evt.offsetX
        diffy = self.starty - evt.offsetY
        console.log {diffx, diffy}
        self.selectionRectangle(self.startx, self.starty, evt.offsetX, evt.offsetY)
      #console.log 'pointermove'
      #console.log evt
    $(this).on 'pointerout', (evt) ->
      console.log 'pointerout'
      self.drawing = false
      self.hideSelectionRectangle()
    $(this).on 'pointerleave', (evt) ->
      console.log 'pointerleave'
      self.drawing = false
      self.hideSelectionRectangle()
    $(this).on 'pointerup', (evt) ->
      console.log 'pointerup'
      self.drawing = false
      self.hideSelectionRectangle()
    console.log 'activity started'
    # hammer = new Hammer(this.$$('#contents'))
}