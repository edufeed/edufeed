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
    SM: function(pattern){
      return $(this.querySelectorAll(pattern));
    },
    closeShareWidget: function(){
      return this.$$('#sharingbutton').closeShareWidget();
    },
    closeButtonClicked: function(){
      if (this.$$('#sharingbutton').isShareWidgetOpen()) {
        return this.closeShareWidget();
      } else {
        addlog({
          event: 'task-closed',
          item: this.current_item
        });
        return this.closeActivity();
      }
    },
    doneButtonClicked: function(){
      if (this.$$('#sharingbutton').isShareWidgetOpen()) {
        return this.closeShareWidget();
      } else {
        return this.openTaskFinished(this.current_item);
      }
    },
    helpButtonClicked: function(){
      var itemtype;
      itemtype = this.current_item.itemtype;
      return this.openTutorial(itemtype);
    },
    openTutorial: function(itemtype){
      var tutorial_dom;
      this.SM('.mainscreen').hide();
      this.S('#tutorial').show();
      tutorial_dom = Polymer.dom(this.$$('#tutorial'));
      return tutorial_dom.innerHTML = "<tutorial-display tutorial='" + itemtype + "'></tutorial-display>";
    },
    closeTutorial: function(){
      var tutorial_dom;
      this.SM('.mainscreen').hide();
      tutorial_dom = Polymer.dom(this.$$('#tutorial'));
      tutorial_dom.innerHTML = '';
      return this.S('#activityscreen').show();
    },
    openTaskFinished: function(item){
      var taskfinished_dom;
      addlog({
        event: 'task-finished',
        item: item
      });
      this.itemFinished(item);
      this.SM('.mainscreen').hide();
      this.S('#activity').html('');
      this.$$('#sharingbutton').closeShareWidget();
      this.S('#taskfinished').show();
      taskfinished_dom = Polymer.dom(this.$$('#taskfinished'));
      return taskfinished_dom.innerHTML = "<taskfinished-display></taskfinished-display>";
    },
    closeTaskFinished: function(){
      var tutorial_dom;
      this.SM('.mainscreen').hide();
      tutorial_dom = Polymer.dom(this.$$('#taskfinished'));
      tutorial_dom.innerHTML = '';
      return this.S('#thumbnails').show();
    },
    closeActivity: function(){
      this.SM('.mainscreen').hide();
      this.S('#activity').html('');
      this.S('#thumbnails').show();
      return this.$$('#sharingbutton').closeShareWidget();
    },
    itemFinished: function(item){
      var self;
      self = this;
      return postFinishedItem(item, function(){
        return addNewItemSuggestions(item, self.items, self.finished_items, function(){
          return self.updateItems();
        });
      });
    },
    openItem: function(item){
      var activity, this$ = this;
      this.SM('.mainscreen').hide();
      this.S('#activityscreen').show();
      this.S('#donebutton').hide();
      this.S('#exitbutton').show();
      this.S('#activity').html('');
      this.current_item = item;
      activity = makeActivity(item);
      activity[0].addEventListener('task-finished', function(){
        if (!activity[0].alreadyleft) {
          activity[0].alreadyleft = true;
          return this$.openTaskFinished(item);
        }
      });
      activity[0].addEventListener('task-left', function(){
        if (!activity[0].alreadyleft) {
          activity[0].alreadyleft = true;
          addlog({
            event: 'task-left',
            item: item
          });
          return this$.closeActivity();
        }
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
              self.finished_items = finished_items;
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
    shareActivity: function(evt){
      var self, username;
      self = this;
      username = evt.detail.username;
      return getUsername(function(local_username){
        var ref$, itemtype, data, social;
        if (username == null) {
          console.log('no username');
          return;
        }
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
      this.addEventListener('hide-admin-activity', function(){
        self.hide_admin_console = true;
        return self.updateItems();
      });
      this.addEventListener('make-all-buttons-transparent', function(){
        return self.S('#activitybuttons').css('opacity', 0);
      });
      this.addEventListener('hide-share-button', function(){
        return self.S('#sharingbutton').hide();
      });
      this.addEventListener('show-share-button', function(){
        return self.S('#sharingbutton').show();
      });
      this.addEventListener('hide-help-button', function(){
        return self.S('#helpbutton').hide();
      });
      this.addEventListener('show-help-button', function(){
        return self.S('#helpbutton').show();
      });
      this.addEventListener('task-freeplay', function(){
        self.S('#exitbutton').hide();
        return self.S('#donebutton').show();
      });
      this.addEventListener('task-notfreeplay', function(){
        self.S('#donebutton').hide();
        return self.S('#exitbutton').show();
      });
      this.addEventListener('close-tutorial', function(){
        return self.closeTutorial();
      });
      this.addEventListener('close-taskfinished', function(){
        return self.closeTaskFinished();
      });
      this.addEventListener('share-activity', function(evt){
        return self.shareActivity(evt);
      });
      this.updateItems(true);
      getUsername(function(username){
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
      return getBoolParam('hidesharebutton', function(hidesharebutton){
        return getBoolParam('hidehelpbutton', function(hidehelpbutton){
          if (hidesharebutton) {
            self.S('#sharingbutton').hide();
          }
          if (hidehelpbutton) {
            return self.S('#helpbutton').hide();
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
