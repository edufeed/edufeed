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
          event: 'task-left',
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
      stop_sound();
      this.SM('.mainscreen').hide();
      this.S('#tutorial').show();
      tutorial_dom = Polymer.dom(this.$$('#tutorial'));
      tutorial_dom.innerHTML = "<tutorial-display tutorial='" + itemtype + "'></tutorial-display>";
      addlog({
        'tutorial-opened': 'tutorial-opened',
        item: this.current_item
      });
      return this.currentactivitytype = 'tutorial';
    },
    closeTutorial: function(){
      var tutorial_dom;
      stop_sound();
      this.SM('.mainscreen').hide();
      tutorial_dom = Polymer.dom(this.$$('#tutorial'));
      tutorial_dom.innerHTML = '';
      this.S('#activityscreen').show();
      return this.currentactivitytype = this.current_item.itemtype;
    },
    openTaskFinished: function(item){
      var taskfinished_dom;
      stop_sound();
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
      taskfinished_dom.innerHTML = "<taskfinished-display></taskfinished-display>";
      return this.currentactivitytype = 'taskfinished-sharing';
    },
    closeTaskFinished: function(){
      var tutorial_dom;
      stop_sound();
      this.SM('.mainscreen').hide();
      tutorial_dom = Polymer.dom(this.$$('#taskfinished'));
      tutorial_dom.innerHTML = '';
      return this.S('#thumbnails').show();
    },
    closeActivity: function(){
      stop_sound();
      this.SM('.mainscreen').hide();
      this.S('#activity').html('');
      this.S('#thumbnails').show();
      this.$$('#sharingbutton').closeShareWidget();
      return this.currentactivitytype = 'side-scroll-feed';
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
      this.currentactivitytype = item.itemtype;
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
      activity.appendTo(this.S('#activity'));
      return bumpFeedItemUpdateTime(item, function(){
        return this$.updateItems();
      });
    },
    addItemToFeed: function(item, idx){
      var thumbnail, this$ = this;
      thumbnail = makeSocialThumbnail(item);
      thumbnail.find('#thumbnail').click(function(){
        var password;
        if (item.itemtype !== 'admin') {
          addlog({
            event: 'task-started',
            item: item
          });
          return this$.openItem(item);
        } else {
          password = prompt("Password: ");
          if (password === 'edu') {
            addlog({
              event: 'task-started',
              item: item
            });
            return this$.openItem(item);
          }
        }
      });
      if (idx == null) {
        return this.S('#thumbnails').append(thumbnail);
      } else {
        return this.S('#thumbnails').insertAt(idx, thumbnail);
      }
    },
    removeItemFromFeed: function(idx){
      var thumbnail;
      thumbnail = this.S('#thumbnails').children().eq(idx);
      return thumbnail.remove();
    },
    updateSocialThumbnail: function(item, idx){
      var thumbnail;
      if (item == null || item.social == null) {
        return;
      }
      thumbnail = this.S('#thumbnails').children().eq(idx);
      return thumbnail.prop(item.social);
    },
    itemsChanged: function(newitems, olditems){
      var edits, i$, len$, edit, action, idx, item, new_social, ref$, old_social, results$ = [];
      if (deepEq$(newitems, olditems, '===')) {
        return;
      }
      newitems = newitems != null
        ? newitems
        : [];
      olditems = olditems != null
        ? olditems
        : [];
      edits = edit_sequence(newitems, olditems, itemtype_and_data_matches);
      for (i$ = 0, len$ = edits.length; i$ < len$; ++i$) {
        edit = edits[i$];
        action = edit.action, idx = edit.idx, item = edit.item;
        if (action === 'EQUAL') {
          new_social = (ref$ = item.social) != null
            ? ref$
            : {};
          old_social = (ref$ = edit.olditem.social) != null
            ? ref$
            : {};
          if (!deepEq$(new_social, old_social, '===')) {
            this.updateSocialThumbnail(item, idx);
          }
        }
        if (action === 'DELETE') {
          this.removeItemFromFeed(idx);
        }
        if (action === 'INSERT') {
          results$.push(this.addItemToFeed(item, idx));
        }
      }
      return results$;
    }
    /*
    itemsChanged: (newitems, olditems) ->
      if newitems === olditems
        return
      this.S('#thumbnails').html('')
      for item in this.items
        this.addItemToFeed item
    */,
    sortByUpdateTime: function(docs){
      return docs.sort(function(a, b){
        var a_updatetime, b_updatetime;
        a_updatetime = 0;
        if (a != null && a.updatetime != null) {
          a_updatetime = a.updatetime;
        }
        b_updatetime = 0;
        if (b != null && b.updatetime != null) {
          b_updatetime = b.updatetime;
        }
        return b_updatetime - a_updatetime;
      });
    },
    removeFinishedItems: function(origItems, finishedItems, username){
      var newItemsList, i$, len$, item, matching_finished_item, res$, j$, len1$, x;
      if (finishedItems.length === 0) {
        return origItems;
      }
      newItemsList = [];
      for (i$ = 0, len$ = origItems.length; i$ < len$; ++i$) {
        item = origItems[i$];
        if (item.social == null) {
          newItemsList.push(item);
        } else {
          res$ = [];
          for (j$ = 0, len1$ = finishedItems.length; j$ < len1$; ++j$) {
            x = finishedItems[j$];
            if (itemtype_and_data_matches(item, x)) {
              res$.push(x);
            }
          }
          matching_finished_item = res$;
          if (matching_finished_item.length > 0) {
            if (!in$(username, matching_finished_item[0].social.finishedby)) {
              newItemsList.push(item);
            }
          } else {
            newItemsList.push(item);
          }
        }
      }
      return newItemsList;
    },
    filterItems: function(origItems, classmates){
      var maxLength, sharedMax, noSharedMax, newOrigItems, i$, len$, item, filteredList, adminItem, noSharedItemsList, sharedItemsList, NSIL_len, SIL_len, to$, x, y;
      maxLength = 10;
      sharedMax = 6;
      noSharedMax = 4;
      if (origItems.length <= maxLength) {
        console.log('origItems only has ' + origItems.length + ' items');
        newOrigItems = [];
        for (i$ = 0, len$ = origItems.length; i$ < len$; ++i$) {
          item = origItems[i$];
          if (item.itemtype !== 'dots' && item.itemtype !== 'readaloud' && item.itemtype !== 'typeletter' && item.itemtype !== 'bars') {
            newOrigItems.push(item);
          }
        }
        return newOrigItems;
      }
      filteredList = [];
      adminItem = [];
      noSharedItemsList = [];
      sharedItemsList = [];
      for (i$ = 0, len$ = origItems.length; i$ < len$; ++i$) {
        item = origItems[i$];
        if (item.itemtype === 'admin') {
          adminItem.push(item);
        } else if (item.itemtype !== 'dots' && item.itemtype !== 'readaloud' && item.itemtype !== 'typeletter' && item.itemtype !== 'bars') {
          if (item.social == null) {
            noSharedItemsList.push(item);
          } else if (!in$(item.social.poster, classmates)) {
            noSharedItemsList.push(item);
          } else {
            sharedItemsList.push(item);
          }
        }
      }
      console.log('origItems length: ' + origItems.length);
      console.log('noSharedItemsList length: ' + noSharedItemsList.length);
      console.log('sharedItemsList length: ' + sharedItemsList.length);
      NSIL_len = noSharedItemsList.length;
      SIL_len = sharedItemsList.length;
      if (NSIL_len <= noSharedMax && SIL_len <= sharedMax) {
        filteredList = noSharedItemsList.concat(sharedItemsList);
      } else if (NSIL_len > noSharedMax && SIL_len > sharedMax) {
        for (i$ = 0, to$ = noSharedMax - 1; i$ <= to$; ++i$) {
          x = i$;
          filteredList.push(noSharedItemsList[x]);
        }
        for (i$ = 0, to$ = sharedMax - 1; i$ <= to$; ++i$) {
          y = i$;
          filteredList.push(sharedItemsList[y]);
        }
        /* Oldest items stay in feed
        for x from NSIL_len-1 to NSIL_len-noSharedMax by -1
          filteredList.push(noSharedItemsList[x])
        for y from SIL_len-1 to SIL_len-sharedMax by -1
          filteredList.push(sharedItemsList[y])*/
      } else if (NSIL_len > noSharedMax && SIL_len <= sharedMax) {
        filteredList = sharedItemsList;
        for (i$ = 0, to$ = NSIL_len - 1; i$ <= to$; ++i$) {
          x = i$;
          if (filteredList.length < maxLength) {
            filteredList.push(noSharedItemsList[x]);
          } else {
            console.log('filtered list length: ' + filteredList.length);
            filteredList = filteredList.concat(adminItem);
            return filteredList;
          }
        }
      } else if (NSIL_len <= noSharedMax && SIL_len > sharedMax) {
        filteredList = noSharedItemsList;
        for (i$ = 0, to$ = sharedMax - 1; i$ <= to$; ++i$) {
          x = i$;
          if (filteredList.length < maxLength) {
            filteredList.push(sharedItemsList[x]);
          } else {
            console.log('filtered list length: ' + filteredList.length);
            filteredList = filteredList.concat(adminItem);
            return filteredList;
          }
        }
      }
      console.log('filtered list length: ' + filteredList.length);
      filteredList = filteredList.concat(adminItem);
      return filteredList;
    },
    removeDuplicates: function(origItems){
      var noDuplicates, isDuplicate, i$, len$, item1, j$, len1$, item2;
      noDuplicates = [origItems[0]];
      isDuplicate = false;
      for (i$ = 0, len$ = origItems.length; i$ < len$; ++i$) {
        item1 = origItems[i$];
        for (j$ = 0, len1$ = noDuplicates.length; j$ < len1$; ++j$) {
          item2 = noDuplicates[j$];
          if (itemtype_and_data_matches(item2, item1)) {
            if (item2.social != null && item1.social != null) {
              if (item2.social.poster === item1.social.poster) {
                isDuplicate = true;
              }
            } else {
              isDuplicate = true;
            }
          }
        }
        if (!isDuplicate) {
          noDuplicates.push(item1);
        } else {
          isDuplicate = false;
        }
      }
      return noDuplicates;
    },
    updateItems: function(firstvisit){
      var self;
      self = this;
      return getUsername(function(username){
        return getClassmates(username, function(classmates){
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
                    poster: 'tablet'
                  },
                  updatetime: 0
                }].concat(docs);
              }
              return getFinishedItems(function(finished_items){
                var i$, ref$, len$, doc, matching_finished_items, res$, j$, len1$, x, noFinishedItemsList, noDuplicateItemsList, sortedItems, filteredItems;
                self.finished_items = finished_items;
                for (i$ = 0, len$ = (ref$ = docs).length; i$ < len$; ++i$) {
                  doc = ref$[i$];
                  if (doc.social == null) {
                    doc.social = {};
                  }
                  doc.social.myname = username;
                  res$ = [];
                  for (j$ = 0, len1$ = finished_items.length; j$ < len1$; ++j$) {
                    x = finished_items[j$];
                    if (itemtype_and_data_matches(doc, x)) {
                      res$.push(x);
                    }
                  }
                  matching_finished_items = res$;
                  if (matching_finished_items.length > 0) {
                    doc.social.finishedby = matching_finished_items[0].social.finishedby;
                  }
                }
                noFinishedItemsList = self.removeFinishedItems(docs, finished_items, username);
                noDuplicateItemsList = self.removeDuplicates(noFinishedItemsList);
                sortedItems = self.sortByUpdateTime(noDuplicateItemsList);
                filteredItems = self.filterItems(sortedItems, classmates);
                self.items = self.sortByUpdateTime(filteredItems);
                if (firstvisit != null && firstvisit) {
                  return addlog({
                    event: 'visitfeed'
                  });
                }
              });
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
        var ref$, itemtype, data, social_sharing_data, k, v;
        if (username == null) {
          console.log('no username');
          return;
        }
        ref$ = self.current_item, itemtype = ref$.itemtype, data = ref$.data;
        if (itemtype == null) {
          console.log('do not have itemtype');
          return;
        }
        social_sharing_data = getSocialSharingData(itemtype);
        if (social_sharing_data != null) {
          for (k in social_sharing_data) {
            v = social_sharing_data[k];
            data[k] = v;
          }
        }
        postItemToTarget(username, {
          itemtype: itemtype,
          data: data,
          social: {
            poster: local_username
          }
        });
        return addlog({
          event: 'shareactivity',
          targetuser: username,
          item: self.current_item
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
      this.addEventListener('make-all-buttons-opaque', function(){
        return self.S('#activitybuttons').css('opacity', 1);
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
          var mostrecentclick, postinterval;
          if (hidesharebutton) {
            self.S('#sharingbutton').hide();
          }
          if (hidehelpbutton) {
            self.S('#helpbutton').hide();
          }
          self.currentactivitytype = 'side-scroll-feed';
          mostrecentclick = Date.now();
          $('body').click(function(){
            return mostrecentclick = Date.now();
          });
          postinterval = 10000;
          return setInterval(function(){
            return addlog({
              event: 'app-still-open',
              'mostrecentclick': mostrecentclick,
              'currenttime': Date.now(),
              'postinterval': postinterval,
              'currentactivitytype': self.currentactivitytype,
              'item': self.current_item
            });
          }, postinterval);
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
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
