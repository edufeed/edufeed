// Generated by LiveScript 1.3.1
(function(){
  var getTaskSuggestionFormulas, getClassPosters, chooseRandomPoster, getItemsFinishedByUser, itemNotInList, getItemType, suggestNextItemOfType, getSuggestions_one_more_of_the_sametype, getItemTypesCompletelyFinished, getItemTypesNotCompletelyFinished, randomSelect, select_random_other_itemtype, getSuggestions_one_of_different_type, suggested_itemtype_history, getSuggestions_three_same_then_one_different, getSuggestions_one_same_and_one_different, processTaskSuggestion, processTaskSuggestions, getNumItemsRecommendedNotShared, addNewItemSuggestions, out$ = typeof exports != 'undefined' && exports || this, slice$ = [].slice;
  out$.getTaskSuggestionFormulas = getTaskSuggestionFormulas = function(){
    return {
      'default': getSuggestions_one_same_and_one_different,
      'one_more_of_the_sametype': getSuggestions_one_more_of_the_sametype,
      'one_of_different_type': getSuggestions_one_of_different_type,
      'three_same_then_one_different': getSuggestions_three_same_then_one_different,
      'one_same_and_one_different': getSuggestions_one_same_and_one_different
    };
  };
  getClassPosters = function(usersClass){
    var posterLists, classname;
    posterLists = getPosterLists();
    classname = usersClass;
    if (classname !== 'classa' && classname !== 'classb' && classname !== 'classc' && classname !== 'classtest') {
      classname = 'other';
    }
    return posterLists[classname];
  };
  chooseRandomPoster = function(usersClass){
    var classPosters, randomPoster;
    classPosters = getClassPosters(usersClass);
    /*console.log 'class posters: ' + classPosters*/
    randomPoster = classPosters[Math.floor(Math.random() * classPosters.length)];
    /*console.log 'randomly chosen poster: ' + randomPoster*/
    return randomPoster;
  };
  getItemsFinishedByUser = function(username, all_finished_items){
    return all_finished_items.filter(function(item){
      return item != null && item.social != null && item.social.finishedby != null && item.social.finishedby.indexOf(username) !== -1;
    });
  };
  itemNotInList = function(item, itemlist){
    var x;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = itemlist).length; i$ < len$; ++i$) {
        x = ref$[i$];
        if (itemtype_and_data_matches(item, x)) {
          results$.push(x);
        }
      }
      return results$;
    }()).length === 0;
  };
  getItemType = function(finished_item){
    var itemtype;
    itemtype = finished_item.itemtype;
    if (itemtype === 'video' && finished_item.data != null && finished_item.data.itemcategory != null) {
      itemtype = finished_item.data.itemcategory;
    }
    return itemtype;
  };
  suggestNextItemOfType = function(options, itemtype){
    var usersClass, current_feed_items, items_finished_by_user, available_items, new_items_not_finished, new_available_items, newitem, newPoster;
    usersClass = options.usersClass, current_feed_items = options.current_feed_items, items_finished_by_user = options.items_finished_by_user;
    available_items = getAllFeedItems()[itemtype];
    if (available_items == null) {
      return [];
    }
    new_items_not_finished = available_items.filter(function(item){
      return itemNotInList(item, items_finished_by_user);
    });
    new_available_items = new_items_not_finished.filter(function(item){
      return itemNotInList(item, current_feed_items);
    });
    if (new_available_items.length === 0) {
      if (new_items_not_finished.length > 0) {
        return [{
          bump: new_items_not_finished[0]
        }];
      }
      return [];
    }
    newitem = new_available_items[0];
    newPoster = chooseRandomPoster(usersClass);
    console.log('new item poster: ' + newPoster);
    newitem.social.poster = newPoster;
    return [{
      post: newitem
    }];
  };
  getSuggestions_one_more_of_the_sametype = function(options){
    var itemtype;
    itemtype = options.itemtype;
    return suggestNextItemOfType(options, itemtype);
  };
  getItemTypesCompletelyFinished = function(items_finished_by_user){
    var output, all_available_items, itemtype, itemlist, finished_items_of_itemtype;
    output = [];
    all_available_items = getAllFeedItems();
    for (itemtype in all_available_items) {
      itemlist = all_available_items[itemtype];
      finished_items_of_itemtype = items_finished_by_user.filter(fn$);
      if (finished_items_of_itemtype.length === itemlist.length) {
        output.push(itemtype);
      }
    }
    return output;
    function fn$(item){
      return itemtype === getItemType(item);
    }
  };
  getItemTypesNotCompletelyFinished = function(items_finished_by_user){
    var completely_finished_itemtypes, i$, ref$, len$, itemtype, itemlist;
    completely_finished_itemtypes = {};
    for (i$ = 0, len$ = (ref$ = getItemTypesCompletelyFinished(items_finished_by_user)).length; i$ < len$; ++i$) {
      itemtype = ref$[i$];
      completely_finished_itemtypes[itemtype] = true;
    }
    return (function(){
      var ref$, results$ = [];
      for (itemtype in ref$ = getAllFeedItems()) {
        itemlist = ref$[itemtype];
        if (completely_finished_itemtypes[itemtype] == null) {
          results$.push(itemtype);
        }
      }
      return results$;
    }());
  };
  randomSelect = function(list){
    var idx;
    idx = Math.floor(Math.random() * list.length);
    return list[idx];
  };
  select_random_other_itemtype = function(options){
    var username, finished_item, current_feed_items, all_finished_items, items_finished_by_user, itemtype, item_types_not_finished, other_item_types_not_finished, res$, i$, len$, x;
    username = options.username, finished_item = options.finished_item, current_feed_items = options.current_feed_items, all_finished_items = options.all_finished_items, items_finished_by_user = options.items_finished_by_user, itemtype = options.itemtype;
    item_types_not_finished = getItemTypesNotCompletelyFinished(items_finished_by_user);
    res$ = [];
    for (i$ = 0, len$ = item_types_not_finished.length; i$ < len$; ++i$) {
      x = item_types_not_finished[i$];
      if (x !== itemtype) {
        res$.push(x);
      }
    }
    other_item_types_not_finished = res$;
    return randomSelect(other_item_types_not_finished);
  };
  getSuggestions_one_of_different_type = function(options){
    var selected_itemtype;
    selected_itemtype = select_random_other_itemtype(options);
    return suggestNextItemOfType(options, selected_itemtype);
  };
  suggested_itemtype_history = [];
  getSuggestions_three_same_then_one_different = function(options){
    var itemtype, number_times_itemtype_was_inserted_most_recently, next_item_type;
    itemtype = options.itemtype;
    number_times_itemtype_was_inserted_most_recently = slice$.call(suggested_itemtype_history, -3).filter(function(item){
      return item.itemtype === itemtype;
    }).length;
    next_item_type = itemtype;
    if (number_times_itemtype_was_inserted_most_recently >= 3) {
      next_item_type = select_random_other_itemtype(options);
    }
    suggested_itemtype_history.push(next_item_type);
    return suggestNextItemOfType(options, next_item_type);
  };
  getSuggestions_one_same_and_one_different = function(options){
    var itemtype, different_itemtype;
    itemtype = options.itemtype;
    different_itemtype = select_random_other_itemtype(options);
    return suggestNextItemOfType(options, itemtype).concat(suggestNextItemOfType(options, different_itemtype));
  };
  processTaskSuggestion = function(task_suggestion, callback){
    if (task_suggestion.post != null) {
      postItemToSelf(task_suggestion.post, callback);
      return;
    }
    if (task_suggestion.bump != null) {
      bumpFeedItemUpdateTime(task_suggestion.bump, callback);
    }
  };
  processTaskSuggestions = function(task_suggestions, callback){
    return async.eachSeries(task_suggestions, function(task_suggestion, ncallback){
      return processTaskSuggestion(task_suggestion, function(){
        return ncallback(null, null);
      });
    }, function(){
      if (callback != null) {
        return callback(null, null);
      }
    });
  };
  getNumItemsRecommendedNotShared = function(current_feed_items, usersClass){
    var numItemsRecommended, i$, len$, item, classPosters;
    numItemsRecommended = 0;
    for (i$ = 0, len$ = current_feed_items.length; i$ < len$; ++i$) {
      item = current_feed_items[i$];
      if (item.social != null) {
        classPosters = getClassPosters(usersClass);
        if (in$(item.social.poster, classPosters)) {
          numItemsRecommended += 1;
        }
      }
    }
    return numItemsRecommended;
  };
  out$.addNewItemSuggestions = addNewItemSuggestions = function(finished_item, current_feed_items, all_finished_items, callback){
    var maxItems;
    maxItems = 999;
    if (current_feed_items.length > maxItems) {
      callback;
    } else {
      return getUsername(function(username){
        return getUsersClass(username, function(usersClass){
          var numItemsRecommended, sharedItemsQueue, sharedItem;
          numItemsRecommended = getNumItemsRecommendedNotShared(current_feed_items, usersClass);
          sharedItemsQueue = [];
          if (numItemsRecommended >= 4 && sharedItemsQueue.length > 0) {
            sharedItem = [sharedItemsQueue[0]];
            console.log('task shared is:');
            console.log(sharedItem);
            return processTaskSuggestions(sharedItem, callback);
          } else {
            return getParam('suggestionformula', function(suggestionformula){
              var items_finished_by_user, itemtype, options, task_suggestion_formula, task_suggestions;
              items_finished_by_user = getItemsFinishedByUser(username, all_finished_items);
              itemtype = getItemType(finished_item);
              options = {
                username: username,
                usersClass: usersClass,
                finished_item: finished_item,
                current_feed_items: current_feed_items,
                all_finished_items: all_finished_items,
                items_finished_by_user: items_finished_by_user,
                itemtype: itemtype
              };
              task_suggestion_formula = null;
              console.log('addNewItemSuggestions');
              if (suggestionformula != null) {
                task_suggestion_formula = getTaskSuggestionFormulas()[suggestionformula];
              }
              if (task_suggestion_formula == null) {
                task_suggestion_formula = getTaskSuggestionFormulas()['default'];
              }
              task_suggestions = task_suggestion_formula(options);
              console.log('task suggestions are:');
              console.log(task_suggestions);
              return processTaskSuggestions(task_suggestions, callback);
            });
          }
        });
      });
    }
  };
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
