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
  computeSelectedDotDimensions: (startx, starty, endx, endy) ->
    minxidx = Number.MAX_VALUE
    maxxidx = -Number.MAX_VALUE
    minyidx = Number.MAX_VALUE
    maxyidx = -Number.MAX_VALUE
    for dotnode in $(this).find('.colordot')
      dot = $(dotnode)
      x = dot.offset().left
      y = dot.offset().top
      if startx <= x <= endx and starty <= y <= endy
        dot.css 'background-color', 'red'
      else
        dot.css 'background-color', 'black'
        continue
      xidx = dot.data('xidx')
      minxidx = Math.min(xidx, minxidx)
      maxxidx = Math.max(xidx, maxxidx)
      yidx = dot.data('yidx')
      minyidx = Math.min(yidx, minyidx)
      maxyidx = Math.max(yidx, maxyidx)
    xdim = maxxidx - minxidx + 1
    ydim = maxyidx - minyidx + 1
    if !isFinite(xdim) or !isFinite(ydim)
      return
    if xdim != this.prev_xdim or ydim != this.prev_ydim
      this.prev_xdim = xdim
      this.prev_ydim = ydim
      this.fire 'selected-dots-changed', {xdim, ydim}
    return
  selectionRectangle: (startx, starty, endx, endy) ->
    selection = this.S('#selection')
    if selection.length == 0
      selection = $('<div>').prop('id', 'selection')
      selection.appendTo this
    selection.show()
    selection.offset({left: startx, top: starty})
    selection.css({width: endx - startx, height: endy - starty})
    this.computeSelectedDotDimensions(startx, starty, endx, endy)
    return
  createDots: ->
    $(this).find('.colordot').remove()
    numdots = this.numdots
    width = this.width
    spacing = width / numdots
    for i in [0 til numdots]
      for j in [0 til numdots]
        newdot = $('<div>')
        newdot.css {
          width: '10px'
          height: '10px'
          'background-color': 'black'
          'border-radius': '50%'
          position: 'absolute'
          top: Math.round(spacing * (i + 0.5)) + 'px'
          left: Math.round(spacing * (j + 0.5)) + 'px'
          'pointer-events': 'noner'
        }
        newdot.data {
          xidx: i
          yidx: j
        }
        newdot.addClass('colordot')
        newdot.appendTo this
  ready: ->
    self = this
    $(this).on 'pointerdown', (evt) ->
      self.drawing = true
      self.startx = evt.offsetX
      self.starty = evt.offsetY
    $(this).on 'pointermove', (evt) ->
      if self.drawing
        diffx = self.startx - evt.offsetX
        diffy = self.starty - evt.offsetY
        self.selectionRectangle(self.startx, self.starty, evt.offsetX, evt.offsetY)
    $(this).on 'pointerout', (evt) ->
      self.drawing = false
      self.hideSelectionRectangle()
    $(this).on 'pointerleave', (evt) ->
      self.drawing = false
      self.hideSelectionRectangle()
    $(this).on 'pointerup', (evt) ->
      self.drawing = false
      self.hideSelectionRectangle()
    console.log 'activity started'
}