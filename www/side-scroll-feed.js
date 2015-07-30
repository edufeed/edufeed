// Generated by LiveScript 1.3.1
(function(){
  Polymer({
    is: 'side-scroll-feed',
    properties: {
      items: {
        type: Array,
        value: [],
        observer: 'itemsChanged'
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    closeActivity: function(){
      this.S('#activity').html('');
      this.S('#thumbnails').show();
      return this.S('#exitbutton').hide();
    },
    itemFinished: function(item){
      var i$, ref$, len$, x, tag, username, ref1$;
      for (i$ = 0, len$ = (ref$ = $('social-thumbnail')).length; i$ < len$; ++i$) {
        x = ref$[i$];
        tag = $(x).find('#thumbnail');
        if (tag == null) {
          return;
        }
        tag = tag[0];
        if (tag == null) {
          return;
        }
        if (tagMatchesItem(tag, item)) {
          console.log('tagMatchesItem');
          console.log(tag);
          console.log(item);
          username = (ref1$ = getLocalStorage().getItem('username')) != null ? ref1$ : 'cat';
          if (x.finishedby.indexOf(username) === -1) {
            x.finishedby = x.finishedby.concat([username]);
          }
        }
      }
    },
    openItem: function(item){
      var activity, this$ = this;
      this.S('#thumbnails').hide();
      this.S('#exitbutton').show();
      this.S('#activity').html('');
      activity = makeActivity(item);
      activity.on('task-finished', function(){
        this$.itemFinished(item);
        return this$.closeActivity();
      });
      return activity.appendTo(this.S('#activity'));
    },
    addItemToFeed: function(item){
      var thumbnail, this$ = this;
      thumbnail = makeSocialThumbnail(item);
      thumbnail.find('#thumbnail').click(function(){
        return this$.openItem(item);
      });
      return this.S('#thumbnails').append(thumbnail);
    },
    itemsChanged: function(newitems, olditems){
      var i$, ref$, len$, item, results$ = [];
      if (deepEq$(newitems, olditems, '===')) {
        return;
      }
      this.S('#thumbnails').html('');
      for (i$ = 0, len$ = (ref$ = this.items).length; i$ < len$; ++i$) {
        item = ref$[i$];
        results$.push(this.addItemToFeed(item));
      }
      return results$;
    },
    ready: function(){
      var self, update_items;
      self = this;
      update_items = function(){
        return getItems('feeditems', function(docs){
          var admin;
          admin = getBoolParam('admin');
          if (docs.length === 0 || (admin && docs.map(function(it){
            return it.itemtype;
          }).indexOf('admin') === -1)) {
            docs = [{
              itemtype: 'admin',
              social: {
                poster: 'horse'
              }
            }].concat(docs);
          }
          return self.items = docs;
        });
      };
      update_items();
      return setSyncHandler('feeditems', function(change){
        return update_items();
      });
    }
  });
  function deepEq$(x, y, type){
    var toString = {}.toString, hasOwnProperty = {}.hasOwnProperty,
        has = function (obj, key) { return hasOwnProperty.call(obj, key); };
    var first = true;
    return eq(x, y, []);
    function eq(a, b, stack) {
      var className, length, size, result, alength, blength, r, key, ref, sizeB;
      if (a == null || b == null) { return a === b; }
      if (a.__placeholder__ || b.__placeholder__) { return true; }
      if (a === b) { return a !== 0 || 1 / a == 1 / b; }
      className = toString.call(a);
      if (toString.call(b) != className) { return false; }
      switch (className) {
        case '[object String]': return a == String(b);
        case '[object Number]':
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          return +a == +b;
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') { return false; }
      length = stack.length;
      while (length--) { if (stack[length] == a) { return true; } }
      stack.push(a);
      size = 0;
      result = true;
      if (className == '[object Array]') {
        alength = a.length;
        blength = b.length;
        if (first) {
          switch (type) {
          case '===': result = alength === blength; break;
          case '<==': result = alength <= blength; break;
          case '<<=': result = alength < blength; break;
          }
          size = alength;
          first = false;
        } else {
          result = alength === blength;
          size = alength;
        }
        if (result) {
          while (size--) {
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))){ break; }
          }
        }
      } else {
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) {
          return false;
        }
        for (key in a) {
          if (has(a, key)) {
            size++;
            if (!(result = has(b, key) && eq(a[key], b[key], stack))) { break; }
          }
        }
        if (result) {
          sizeB = 0;
          for (key in b) {
            if (has(b, key)) { ++sizeB; }
          }
          if (first) {
            if (type === '<<=') {
              result = size < sizeB;
            } else if (type === '<==') {
              result = size <= sizeB
            } else {
              result = size === sizeB;
            }
          } else {
            first = false;
            result = size === sizeB;
          }
        }
      }
      stack.pop();
      return result;
    }
  }
}).call(this);
