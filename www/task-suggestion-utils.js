(function(){
  var getItemsFinishedByUser, itemNotInList, getItemType, getSuggestions_onemoreofthesametype, task_suggestion_formulas, processTaskSuggestion, processTaskSuggestions, addNewItemSuggestions, out$ = typeof exports != 'undefined' && exports || this;
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
  getSuggestions_onemoreofthesametype = function(options){
    var username, finished_item, current_feed_items, all_finished_items, itemtype, available_items, items_finished_by_user, new_items_not_finished, new_available_items, newitem;
    username = options.username, finished_item = options.finished_item, current_feed_items = options.current_feed_items, all_finished_items = options.all_finished_items;
    itemtype = getItemType(finished_item);
    available_items = getAllFeedItems()[itemtype];
    if (available_items == null) {
      return [];
    }
    items_finished_by_user = getItemsFinishedByUser(username, all_finished_items);
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
    return [{
      post: newitem
    }];
  };
  /*
  addNewItemSuggestions_onemoreofthesametype = (options, callback) ->
    {username, finished_item, current_feed_items, all_finished_items} = options
    itemtype = getItemType(finished_item)
    available_items = getAllFeedItems()[itemtype]
    if not available_items?
      if callback?
        callback()
      return
    items_finished_by_user = getItemsFinishedByUser(username, all_finished_items)
    new_available_items = available_items.filter (item) ->
      itemNotInList(item, items_finished_by_user) and itemNotInList(item, current_feed_items)
    if new_available_items.length == 0
      if callback?
        callback()
      return
    newitem = new_available_items[0]
    postItemToSelf newitem, callback
  
  addNewItemSuggestions_randomdifferent = (options, callback) ->
  */
  out$.task_suggestion_formulas = task_suggestion_formulas = {
    'default': getSuggestions_onemoreofthesametype,
    'onemoreofthesametype': getSuggestions_onemoreofthesametype
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
  out$.addNewItemSuggestions = addNewItemSuggestions = function(finished_item, current_feed_items, all_finished_items, callback){
    return getUsername(function(username){
      return getParam('suggestionformula', function(suggestionformula){
        var options, task_suggestion_formula, task_suggestions;
        options = {
          username: username,
          finished_item: finished_item,
          current_feed_items: current_feed_items,
          all_finished_items: all_finished_items
        };
        task_suggestion_formula = null;
        if (suggestionformula != null) {
          task_suggestion_formula = task_suggestion_formulas[suggestionformula];
        }
        if (task_suggestion_formula == null) {
          task_suggestion_formula = task_suggestion_formulas['default'];
        }
        task_suggestions = task_suggestion_formula(options);
        console.log('task suggestions are:');
        console.log(task_suggestions);
        return processTaskSuggestions(task_suggestions, callback);
      });
    });
  };
}).call(this);
