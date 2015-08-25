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
    closeShareWidget: function(){
      return this.$$('#sharingbutton').closeShareWidget();
    },
    closeButtonClicked: function(){
      if (this.$$('#sharingbutton').isShareWidgetOpen()) {
        return this.closeShareWidget();
      } else {
        return this.closeActivity();
      }
    },
    closeActivity: function(){
      this.S('#activity').html('');
      this.S('#thumbnails').show();
      this.S('#activitybuttons').hide();
      return this.$$('#sharingbutton').closeShareWidget();
    },
    itemFinished: function(item){
      var self;
      self = this;
      return postFinishedItem(item, function(){
        return self.updateItems();
      });
    },
    openItem: function(item){
      var activity, this$ = this;
      this.S('#thumbnails').hide();
      this.S('#activitybuttons').show();
      this.S('#activity').html('');
      activity = makeActivity(item);
      activity.on('task-finished', function(){
        addlog({
          event: 'task-finished',
          item: item
        });
        this$.itemFinished(item);
        return this$.closeActivity();
      });
      return activity.appendTo(this.S('#activity'));
    },
    addItemToFeed: function(item){
      var thumbnail, this$ = this;
      thumbnail = makeSocialThumbnail(item);
      thumbnail.find('#thumbnail').click(function(){
        addlog({
          event: 'task-started',
          item: item
        });
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
    updateItems: function(firstvisit){
      var self;
      self = this;
      return getUsername(function(username){
        return getItems("feeditems_" + username, function(docs){
          if (docs == null || docs.length == null) {
            docs = [];
          }
          return getBoolParam('noadmin', function(noadmin){
            if (self.hide_admin_console != null && self.hide_admin_console) {
              noadmin = true;
            }
            if (docs.length === 0 || (!noadmin && docs.map(function(it){
              return it.itemtype;
            }).indexOf('admin') === -1)) {
              docs = [{
                itemtype: 'admin',
                social: {
                  poster: 'horse'
                }
              }].concat(docs);
            }
            return getFinishedItems(function(finished_items){
              var i$, ref$, len$, doc, matching_finished_items, res$, j$, len1$, x;
              for (i$ = 0, len$ = (ref$ = docs).length; i$ < len$; ++i$) {
                doc = ref$[i$];
                res$ = [];
                for (j$ = 0, len1$ = finished_items.length; j$ < len1$; ++j$) {
                  x = finished_items[j$];
                  if (itemtype_and_data_matches(doc, x)) {
                    res$.push(x);
                  }
                }
                matching_finished_items = res$;
                if (matching_finished_items.length > 0) {
                  if (doc.social == null) {
                    doc.social = {};
                  }
                  doc.social.finishedby = matching_finished_items[0].social.finishedby;
                }
              }
              self.items = docs;
              if (firstvisit != null && firstvisit) {
                return addlog({
                  event: 'visitfeed'
                });
              }
            });
          });
        });
      });
    },
    shareActivity: function(obj, evt){
      var self, username;
      self = this;
      username = evt.username;
      return getUsername(function(local_username){
        var ref$, itemtype, data, social;
        console.log('sharing with: ' + username);
        if (username == null) {
          console.log('no username');
          return;
        }
        console.log('current activity info is: ');
        ref$ = self.S('#activity').children()[0].getalldata(), itemtype = ref$.itemtype, data = ref$.data, social = ref$.social;
        if (itemtype == null) {
          console.log('do not have itemtype');
          return;
        }
        return postItemToTarget(username, {
          itemtype: itemtype,
          data: data,
          social: {
            poster: local_username
          }
        });
      });
    },
    ready: function(){
      var self;
      self = this;
      $(this).on('hide-admin-activity', function(){
        self.hide_admin_console = true;
        return self.updateItems();
      });
      this.updateItems(true);
      return getUsername(function(username){
        setSyncHandler("feeditems_" + username, function(change){
          return self.updateItems();
        });
        return getClassmates(username, function(classmates){
          var i$, len$, results$ = [];
          for (i$ = 0, len$ = classmates.length; i$ < len$; ++i$) {
            results$.push((fn$.call(this, classmates[i$])));
          }
          return results$;
          function fn$(classmate){
            return setSyncHandler("finisheditems_" + classmate, function(change){
              return self.updateItems();
            });
          }
        });
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
