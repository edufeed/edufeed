(function(){
  Polymer({
    is: 'colored-span',
    properties: {
      word: {
        type: String,
        value: 'dog',
        observer: 'wordChanged'
      },
      highlightidx: {
        type: Number,
        value: -1,
        observer: 'highlightidxChanged'
      }
    },
    wordToArray: function(x){
      return x.split('');
    },
    wordChanged: function(){},
    indexToId: function(index){
      return 'item' + index;
    },
    highlightidxChanged: function(index){
      var i$, ref$, len$, item, results$ = [];
      for (i$ = 0, len$ = (ref$ = (fn$.call(this))).length; i$ < len$; ++i$) {
        index = ref$[i$];
        item = this.$$('#' + this.indexToId(index));
        if (item != null) {
          results$.push(item.highlighted = this.isHighlighted(index));
        }
      }
      return results$;
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = this.word.length; i$ < to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    },
    isHighlighted: function(index){
      if (index === this.highlightidx) {
        return true;
      }
      return false;
    }
  });
}).call(this);
