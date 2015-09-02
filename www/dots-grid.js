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
      },
      ignoretouch: {
        type: Boolean,
        value: false
      },
      nolabels: {
        type: Boolean,
        value: false,
        observer: 'createDots'
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    hideSelectionRectangle: function(){
      return this.S('#selection').hide();
    },
    computeSelectedDotDimensionsReal: function(startx, starty, endx, endy){
      var minxidx, maxxidx, minyidx, maxyidx, i$, ref$, len$, dotnode, dot, x, y, xidx, yidx, xdim, ydim;
      minxidx = Number.MAX_VALUE;
      maxxidx = -Number.MAX_VALUE;
      minyidx = Number.MAX_VALUE;
      maxyidx = -Number.MAX_VALUE;
      for (i$ = 0, len$ = (ref$ = $(this).find('.colordot')).length; i$ < len$; ++i$) {
        dotnode = ref$[i$];
        dot = $(dotnode);
        x = dot.data('xpos');
        y = dot.data('ypos');
        if ((startx <= x && x <= endx) && (starty <= y && y <= endy)) {
          dot.css('background-color', '#00ADEE');
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
        if (ydim !== this.prev_ydim) {
          $(this).find('.numberlabelhorizontal').css('color', 'black');
          $(this).find('.numberlabelhorizontal_' + (ydim - 1)).css('color', '#EB008B');
        }
        if (xdim !== this.prev_xdim) {
          $(this).find('.numberlabelvertical').css('color', 'black');
          $(this).find('.numberlabelvertical_' + (xdim - 1)).css('color', '#00A551');
        }
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
      if (startx === this.prev_startx && starty === this.prev_starty && endx === this.prev_startx && endy === this.prev_starty) {
        return;
      }
      selection = this.S('#selection');
      if (selection.length === 0) {
        selection = $('<div>').prop('id', 'selection');
        selection.appendTo(this);
      }
      selection.show();
      if (startx !== this.prev_startx || starty !== this.prev_starty) {
        this.prev_startx = startx;
        this.prev_starty = starty;
        selection.offset({
          left: startx,
          top: starty
        });
      }
      selection.css({
        width: endx - startx,
        height: endy - starty
      });
      this.prev_startx = startx;
      this.prev_starty = starty;
      this.computeSelectedDotDimensions(startx, starty, endx, endy);
    },
    createDots: function(){
      var numdots, width, spacing, i$, ref$, len$, i, newlabel, xpos, ypos, lresult$, j$, ref1$, len1$, j, newdot, results$ = [];
      $(this).find('.colordot').remove();
      $(this).find('.numberlabelhorizontal').remove();
      $(this).find('.numberlabelvertical').remove();
      numdots = this.numdots;
      width = this.width;
      spacing = width / numdots;
      if (!this.nolabels) {
        for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
          i = ref$[i$];
          newlabel = $('<div>');
          xpos = Math.round(spacing * (i + 0.5));
          newlabel.css({
            position: 'absolute',
            top: '0px',
            left: xpos + 'px',
            'font-size': '32px'
          });
          newlabel.text(i + 1);
          newlabel.addClass('numberlabelhorizontal');
          newlabel.addClass('numberlabelhorizontal_' + i);
          newlabel.appendTo(this);
        }
      }
      if (!this.nolabels) {
        for (i$ = 0, len$ = (ref$ = (fn1$())).length; i$ < len$; ++i$) {
          i = ref$[i$];
          newlabel = $('<div>');
          ypos = Math.round(spacing * (i + 0.5));
          newlabel.css({
            position: 'absolute',
            left: '5px',
            top: (ypos - 7) + 'px',
            'font-size': '32px'
          });
          newlabel.text(i + 1);
          newlabel.addClass('numberlabelvertical');
          newlabel.addClass('numberlabelvertical_' + i);
          newlabel.appendTo(this);
        }
      }
      for (i$ = 0, len$ = (ref$ = (fn2$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        lresult$ = [];
        for (j$ = 0, len1$ = (ref1$ = (fn3$())).length; j$ < len1$; ++j$) {
          j = ref1$[j$];
          newdot = $('<div>');
          xpos = Math.round(spacing * (j + 0.5));
          ypos = Math.round(spacing * (i + 0.5));
          newdot.css({
            width: '20px',
            height: '20px',
            'background-color': 'black',
            'border-radius': '50%',
            position: 'absolute',
            top: Math.round(spacing * (i + 0.5)) + 'px',
            left: Math.round(spacing * (j + 0.5)) + 'px',
            'pointer-events': 'none'
          });
          newdot.data({
            xidx: i,
            yidx: j,
            xpos: xpos,
            ypos: ypos
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
      function fn2$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = numdots; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
      function fn3$(){
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
      this.computeSelectedDotDimensions = _.throttle(this.computeSelectedDotDimensionsReal, 100);
      $(this).on('pointerdown', function(evt){
        if (self.ignoretouch) {
          return;
        }
        self.drawing = true;
        self.startx = 0;
        return self.starty = 0;
      });
      $(this).on('pointermove', function(evt){
        var diffx, diffy;
        if (self.ignoretouch) {
          return;
        }
        if (self.drawing) {
          diffx = self.startx - evt.offsetX;
          diffy = self.starty - evt.offsetY;
          return self.selectionRectangle(self.startx, self.starty, evt.offsetX, evt.offsetY);
        }
      });
      $(this).on('pointerleave', function(evt){
        if (self.ignoretouch) {
          return;
        }
        self.drawing = false;
        self.hideSelectionRectangle();
        return self.fire('pointer-released-dimensions', {
          xdim: this.prev_xdim,
          ydim: this.prev_ydim
        });
      });
      $(this).on('pointerup', function(evt){
        if (self.ignoretouch) {
          return;
        }
        self.drawing = false;
        self.hideSelectionRectangle();
        return self.fire('pointer-released-dimensions', {
          xdim: this.prev_xdim,
          ydim: this.prev_ydim
        });
      });
      return console.log('activity started');
    }
  });
}).call(this);
