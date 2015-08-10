(function(){
  Polymer({
    is: 'dots-grid',
    properties: {
      numdots: {
        type: Number,
        value: 5,
        observer: 'createDots'
      },
      width: {
        type: Number,
        value: 500,
        observer: 'createDots'
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    hideSelectionRectangle: function(){
      return this.S('#selection').hide();
    },
    computeSelectedDotDimensions: function(startx, starty, endx, endy){
      var minxidx, maxxidx, minyidx, maxyidx, i$, ref$, len$, dotnode, dot, x, y, xidx, yidx, xdim, ydim;
      minxidx = Number.MAX_VALUE;
      maxxidx = -Number.MAX_VALUE;
      minyidx = Number.MAX_VALUE;
      maxyidx = -Number.MAX_VALUE;
      for (i$ = 0, len$ = (ref$ = $(this).find('.colordot')).length; i$ < len$; ++i$) {
        dotnode = ref$[i$];
        dot = $(dotnode);
        x = dot.offset().left;
        y = dot.offset().top;
        if ((startx <= x && x <= endx) && (starty <= y && y <= endy)) {
          dot.css('background-color', 'red');
        } else {
          dot.css('background-color', 'black');
          continue;
        }
        xidx = dot.data('xidx');
        minxidx = Math.min(xidx, minxidx);
        maxxidx = Math.max(xidx, maxxidx);
        yidx = dot.data('yidx');
        minyidx = Math.min(yidx, minyidx);
        maxyidx = Math.max(yidx, maxyidx);
      }
      xdim = maxxidx - minxidx + 1;
      ydim = maxyidx - minyidx + 1;
      if (!isFinite(xdim) || !isFinite(ydim)) {
        xdim = 0;
        ydim = 0;
      }
      if (xdim !== this.prev_xdim || ydim !== this.prev_ydim) {
        this.prev_xdim = xdim;
        this.prev_ydim = ydim;
        this.fire('selected-dots-changed', {
          xdim: xdim,
          ydim: ydim
        });
      }
    },
    selectionRectangle: function(startx, starty, endx, endy){
      var selection;
      selection = this.S('#selection');
      if (selection.length === 0) {
        selection = $('<div>').prop('id', 'selection');
        selection.appendTo(this);
      }
      selection.show();
      selection.offset({
        left: startx,
        top: starty
      });
      selection.css({
        width: endx - startx,
        height: endy - starty
      });
      this.computeSelectedDotDimensions(startx, starty, endx, endy);
    },
    createDots: function(){
      var numdots, width, spacing, i$, ref$, len$, i, lresult$, j$, ref1$, len1$, j, newdot, results$ = [];
      $(this).find('.colordot').remove();
      numdots = this.numdots;
      width = this.width;
      spacing = width / numdots;
      for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        lresult$ = [];
        for (j$ = 0, len1$ = (ref1$ = (fn1$())).length; j$ < len1$; ++j$) {
          j = ref1$[j$];
          newdot = $('<div>');
          newdot.css({
            width: '10px',
            height: '10px',
            'background-color': 'black',
            'border-radius': '50%',
            position: 'absolute',
            top: Math.round(spacing * (i + 0.5)) + 'px',
            left: Math.round(spacing * (j + 0.5)) + 'px',
            'pointer-events': 'noner'
          });
          newdot.data({
            xidx: i,
            yidx: j
          });
          newdot.addClass('colordot');
          lresult$.push(newdot.appendTo(this));
        }
        results$.push(lresult$);
      }
      return results$;
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = numdots; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
      function fn1$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = numdots; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    },
    ready: function(){
      var self;
      self = this;
      $(this).on('pointerdown', function(evt){
        self.drawing = true;
        self.startx = evt.offsetX;
        return self.starty = evt.offsetY;
      });
      $(this).on('pointermove', function(evt){
        var diffx, diffy;
        if (self.drawing) {
          diffx = self.startx - evt.offsetX;
          diffy = self.starty - evt.offsetY;
          return self.selectionRectangle(self.startx, self.starty, evt.offsetX, evt.offsetY);
        }
      });
      $(this).on('pointerout', function(evt){
        self.drawing = false;
        return self.hideSelectionRectangle();
      });
      $(this).on('pointerleave', function(evt){
        self.drawing = false;
        return self.hideSelectionRectangle();
      });
      $(this).on('pointerup', function(evt){
        self.drawing = false;
        return self.hideSelectionRectangle();
      });
      return console.log('activity started');
    }
  });
}).call(this);
