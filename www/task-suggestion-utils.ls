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

getSuggestions_onemoreofthesametype = (options) ->
  {username, finished_item, current_feed_items, all_finished_items} = options
  itemtype = getItemType(finished_item)
  available_items = getAllFeedItems()[itemtype]
  if not available_items?
    return []
  items_finished_by_user = getItemsFinishedByUser(username, all_finished_items)
  new_items_not_finished = available_items.filter (item) ->
    itemNotInList(item, items_finished_by_user)
  new_available_items = new_items_not_finished.filter (item) ->
    itemNotInList(item, current_feed_items)
  if new_available_items.length == 0
    if new_items_not_finished.length > 0
      return [{bump: new_items_not_finished[0]}]
    return []
  newitem = new_available_items[0]
  return [{post: newitem}]

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

export task_suggestion_formulas = {
  'default': getSuggestions_onemoreofthesametype
  'onemoreofthesametype': getSuggestions_onemoreofthesametype
  #'sametypeplusextra': addNewItemSuggestions_sametypeplusextra
}

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

export addNewItemSuggestions = (finished_item, current_feed_items, all_finished_items, callback) ->
  username <- getUsername()
  suggestionformula <- getParam('suggestionformula')
  options = {username, finished_item, current_feed_items, all_finished_items}
  task_suggestion_formula = null
  if suggestionformula?
    task_suggestion_formula = task_suggestion_formulas[suggestionformula]
  if not task_suggestion_formula?
    task_suggestion_formula = task_suggestion_formulas.default
  #task_suggestion_formula(options, callback)
  task_suggestions = task_suggestion_formula(options)
  console.log 'task suggestions are:'
  console.log task_suggestions
  processTaskSuggestions(task_suggestions, callback)
