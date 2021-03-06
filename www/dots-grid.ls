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
    ignoretouch: {
      type: Boolean
      value: false
    }
    nolabels: {
      type: Boolean
      value: false
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
        dot.css 'background-color', '#00ADEE'
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
      if ydim != this.prev_ydim
        $(this).find('.numberlabelhorizontal').css('color', 'black')
        $(this).find('.numberlabelhorizontal_' + (ydim - 1)).css('color', '#EB008B')
      if xdim != this.prev_xdim
        $(this).find('.numberlabelvertical').css('color', 'black')
        $(this).find('.numberlabelvertical_' + (xdim - 1)).css('color', '#00A551')
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
    $(this).find('.numberlabelhorizontal').remove()
    $(this).find('.numberlabelvertical').remove()
    numdots = this.numdots
    width = this.width
    spacing = width / numdots
    if not this.nolabels
      for i in [0 til numdots]
        newlabel = $('<div>')
        xpos = Math.round(spacing * (i + 0.5))
        newlabel.css {
          position: 'absolute'
          top: '0px'
          left: xpos + 'px'
          'font-size': '32px'
        }
        newlabel.text(i + 1)
        newlabel.addClass('numberlabelhorizontal')
        newlabel.addClass('numberlabelhorizontal_' + i)
        newlabel.appendTo this
    if not this.nolabels
      for i in [0 til numdots]
        newlabel = $('<div>')
        ypos = Math.round(spacing * (i + 0.5))
        newlabel.css {
          position: 'absolute'
          left: '5px'
          top: (ypos - 7) + 'px'
          'font-size': '32px'
        }
        newlabel.text(i + 1)
        newlabel.addClass('numberlabelvertical')
        newlabel.addClass('numberlabelvertical_' + i)
        newlabel.appendTo this
    for i in [0 til numdots]
      for j in [0 til numdots]
        newdot = $('<div>')
        xpos = Math.round(spacing * (j + 0.5))
        ypos = Math.round(spacing * (i + 0.5))
        newdot.css {
          width: '20px'
          height: '20px'
          'background-color': 'black'
          'border-radius': '50%'
          position: 'absolute'
          top: Math.round(spacing * (i + 0.5)) + 'px'
          left: Math.round(spacing * (j + 0.5)) + 'px'
          'pointer-events': 'none'
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
      if self.ignoretouch
        return
      self.drawing = true
      #self.startx = evt.offsetX
      #self.starty = evt.offsetY
      self.startx = 0
      self.starty = 0
    $(this).on 'pointermove', (evt) ->
      if self.ignoretouch
        return
      if self.drawing
        diffx = self.startx - evt.offsetX
        diffy = self.starty - evt.offsetY
        self.selectionRectangle(self.startx, self.starty, evt.offsetX, evt.offsetY)
    #$(this).on 'pointerout', (evt) ->
    #  self.drawing = false
    #  self.hideSelectionRectangle()
    $(this).on 'pointerleave', (evt) ->
      if self.ignoretouch
        return
      self.drawing = false
      self.hideSelectionRectangle()
      self.fire 'pointer-released-dimensions', {xdim: this.prev_xdim, ydim: this.prev_ydim}
    $(this).on 'pointerup', (evt) ->
      if self.ignoretouch
        return
      self.drawing = false
      self.hideSelectionRectangle()
      self.fire 'pointer-released-dimensions', {xdim: this.prev_xdim, ydim: this.prev_ydim}
    console.log 'activity started'
}