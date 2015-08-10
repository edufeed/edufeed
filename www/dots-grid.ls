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
  computeSelectedDotDimensionsReal: (startx, starty, endx, endy) ->
    minxidx = Number.MAX_VALUE
    maxxidx = -Number.MAX_VALUE
    minyidx = Number.MAX_VALUE
    maxyidx = -Number.MAX_VALUE
    for dotnode in $(this).find('.colordot')
      dot = $(dotnode)
      x = dot.data('xpos')
      y = dot.data('ypos')
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
      xdim = 0
      ydim = 0
    if xdim != this.prev_xdim or ydim != this.prev_ydim
      this.prev_xdim = xdim
      this.prev_ydim = ydim
      this.fire 'selected-dots-changed', {xdim, ydim}
    return
  selectionRectangle: (startx, starty, endx, endy) ->
    if startx == this.prev_startx and starty == this.prev_starty and endx == this.prev_startx and endy == this.prev_starty
      return
    selection = this.S('#selection')
    if selection.length == 0
      selection = $('<div>').prop('id', 'selection')
      selection.appendTo this
    selection.show()
    if startx != this.prev_startx or starty != this.prev_starty
      this.prev_startx = startx
      this.prev_starty = starty
      selection.offset({left: startx, top: starty})
    selection.css({width: endx - startx, height: endy - starty})
    this.prev_startx = startx
    this.prev_starty = starty
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
        xpos = Math.round(spacing * (j + 0.5))
        ypos = Math.round(spacing * (i + 0.5))
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
          xpos: xpos
          ypos: ypos
        }
        newdot.addClass('colordot')
        newdot.appendTo this
  ready: ->
    self = this
    this.computeSelectedDotDimensions = _.throttle(this.computeSelectedDotDimensionsReal, 100)
    $(this).on 'pointerdown', (evt) ->
      self.drawing = true
      self.startx = evt.offsetX
      self.starty = evt.offsetY
    $(this).on 'pointermove', (evt) ->
      if self.drawing
        diffx = self.startx - evt.offsetX
        diffy = self.starty - evt.offsetY
        self.selectionRectangle(self.startx, self.starty, evt.offsetX, evt.offsetY)
    #$(this).on 'pointerout', (evt) ->
    #  console.log 'pointerout'
    #  self.drawing = false
    #  self.hideSelectionRectangle()
    $(this).on 'pointerleave', (evt) ->
      console.log 'pointerleave'
      self.drawing = false
      self.hideSelectionRectangle()
    $(this).on 'pointerup', (evt) ->
      console.log 'pointerup'
      self.drawing = false
      self.hideSelectionRectangle()
    console.log 'activity started'
}