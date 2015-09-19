export getTaskSuggestionFormulas = ->
  return {
    'default': getSuggestions_one_same_and_one_different
    'one_more_of_the_sametype': getSuggestions_one_more_of_the_sametype
    'one_of_different_type': getSuggestions_one_of_different_type
    'three_same_then_one_different': getSuggestions_three_same_then_one_different
    'one_same_and_one_different': getSuggestions_one_same_and_one_different
    #'sametypeplusextra': addNewItemSuggestions_sametypeplusextra
  }

getClassPosters = (usersClass) ->
  posterLists = getPosterLists()
  classname = usersClass
  if classname not in ['classa', 'classb', 'classc', 'classtest']
    classname = 'other'
  return posterLists[classname]

chooseRandomPoster = (usersClass) ->
  classPosters = getClassPosters(usersClass)
  /*console.log 'class posters: ' + classPosters*/
  randomPoster = classPosters[Math.floor(Math.random() * classPosters.length)]
  /*console.log 'randomly chosen poster: ' + randomPoster*/
  return randomPoster

getItemsFinishedByUser = (username, all_finished_items) ->
  return all_finished_items.filter (item) ->
    item? and item.social? and item.social.finishedby? and item.social.finishedby.indexOf(username) != -1

itemNotInList = (item, itemlist) ->
  return [x for x in itemlist when itemtype_and_data_matches(item, x)].length == 0

getItemType = (finished_item) ->
  itemtype = finished_item.itemtype
  if itemtype == 'video' and finished_item.data? and finished_item.data.itemcategory?
    itemtype = finished_item.data.itemcategory
  return itemtype

suggestNextItemOfType = (options, itemtype) ->
  {usersClass, current_feed_items, items_finished_by_user} = options
  available_items = getAllFeedItems()[itemtype]
  if not available_items?
    return []
  new_items_not_finished = available_items.filter (item) ->
    itemNotInList(item, items_finished_by_user)
  new_available_items = new_items_not_finished.filter (item) ->
    itemNotInList(item, current_feed_items)
  if new_available_items.length == 0
    if new_items_not_finished.length > 0
      return [{bump: new_items_not_finished[0]}]
    return []
  newitem = new_available_items[0]
  newPoster = chooseRandomPoster(usersClass)
  console.log 'new item poster: ' + newPoster
  newitem.social.poster = newPoster
  return [{post: newitem}]

getSuggestions_one_more_of_the_sametype = (options) ->
  {itemtype} = options
  return suggestNextItemOfType(options, itemtype)

getItemTypesCompletelyFinished = (items_finished_by_user) ->
  output = []
  all_available_items = getAllFeedItems()
  for itemtype,itemlist of all_available_items
    finished_items_of_itemtype = items_finished_by_user.filter (item) ->
      itemtype == getItemType(item)
    if finished_items_of_itemtype.length == itemlist.length
      output.push itemtype
  return output

getItemTypesNotCompletelyFinished = (items_finished_by_user) ->
  completely_finished_itemtypes = {}
  for itemtype in getItemTypesCompletelyFinished(items_finished_by_user)
    completely_finished_itemtypes[itemtype] = true
  return [itemtype for itemtype,itemlist of getAllFeedItems() when not completely_finished_itemtypes[itemtype]?]

randomSelect = (list) ->
  idx = Math.floor(Math.random() * list.length)
  return list[idx]

select_random_other_itemtype = (options) ->
  {username, finished_item, current_feed_items, all_finished_items, items_finished_by_user, itemtype} = options
  item_types_not_finished = getItemTypesNotCompletelyFinished(items_finished_by_user)
  other_item_types_not_finished = [x for x in item_types_not_finished when x != itemtype]
  return randomSelect(other_item_types_not_finished)

getSuggestions_one_of_different_type = (options) ->
  selected_itemtype = select_random_other_itemtype(options)
  return suggestNextItemOfType(options, selected_itemtype)

suggested_itemtype_history = []
getSuggestions_three_same_then_one_different = (options) ->
  {itemtype} = options
  number_times_itemtype_was_inserted_most_recently = suggested_itemtype_history[-3 to].filter((item) -> item.itemtype == itemtype).length
  next_item_type = itemtype
  if number_times_itemtype_was_inserted_most_recently >= 3
    next_item_type = select_random_other_itemtype(options)
  suggested_itemtype_history.push(next_item_type)
  return suggestNextItemOfType(options, next_item_type)

getSuggestions_one_same_and_one_different = (options) ->
  {itemtype} = options
  different_itemtype = select_random_other_itemtype(options)
  return suggestNextItemOfType(options, itemtype) ++ suggestNextItemOfType(options, different_itemtype)

processTaskSuggestion = (task_suggestion, callback) ->
  if task_suggestion.post?
    postItemToSelf task_suggestion.post, callback
    return
  if task_suggestion.bump?
    bumpFeedItemUpdateTime task_suggestion.bump, callback
    return

processTaskSuggestions = (task_suggestions, callback) ->
  async.eachSeries task_suggestions, (task_suggestion, ncallback) ->
    processTaskSuggestion task_suggestion, ->
      ncallback(null, null)
  , ->
    if callback?
      callback(null, null)

# Returns the number of feed items that were *recommended* to the user
# (not shared/posted by another user to this user)
getNumItemsRecommendedNotShared = (current_feed_items, usersClass) ->
  numItemsRecommended = 0
  for item in current_feed_items
    if item.social?
      classPosters = getClassPosters(usersClass)
      if item.social.poster in classPosters
        numItemsRecommended += 1
  return numItemsRecommended

export addNewItemSuggestions = (finished_item, current_feed_items, all_finished_items, callback) ->
  # Don't add any new items if the feed already has 10 items
  if current_feed_items.length > 10
    callback
    return
  else
    # If there is room to make recommendations, do so
    username <- getUsername()
    usersClass <- getUsersClass(username)

    numItemsRecommended = getNumItemsRecommendedNotShared(current_feed_items, usersClass)

    sharedItemsQueue = [] #Should be a function here

    # If there are already at least 4 items in the feed that have been recommended to the user
    # And there are still items to be shared to this user, then add the first to the feed
    if numItemsRecommended >= 4 and sharedItemsQueue.length > 0
      # Set the oldest shared item from the queue to be the suggested task
      sharedItem = [sharedItemsQueue[0]]
      # Post the suggested tasks to the feed
      console.log 'task shared is:'
      console.log sharedItem
      processTaskSuggestions(sharedItem, callback)
    else
    # Otherwise, recommend tasks normally
      suggestionformula <- getParam('suggestionformula')
      items_finished_by_user = getItemsFinishedByUser(username, all_finished_items)
      itemtype = getItemType(finished_item)
      options = {username, usersClass, finished_item, current_feed_items, all_finished_items, items_finished_by_user, itemtype}
      task_suggestion_formula = null
      console.log 'addNewItemSuggestions'
      if suggestionformula?
        task_suggestion_formula = getTaskSuggestionFormulas()[suggestionformula]
      if not task_suggestion_formula?
        task_suggestion_formula = getTaskSuggestionFormulas().default
      task_suggestions = task_suggestion_formula(options)
      console.log 'task suggestions are:'
      console.log task_suggestions
      processTaskSuggestions(task_suggestions, callback)
    
