require! {
  yamlfile
}

item_matches_query = (item, query) ->
  if not query?
    return true
  for k,v of query
    if not item[k]? or v != item[k]
      return false
  return true

export filter_by_query = (logs, query) ->
  return [x for x in logs when item_matches_query(x, query)]

filter_out_activities = (logs, ignored_activities, ignore_before_timestamp) ->
  noIgnoredActivities = [x for x in logs when ignored_activities.indexOf(x.itemtype) == -1]
  return [x for x in noIgnoredActivities when x.updatetime >= ignore_before_timestamp]

itemtype_and_data_matches_v2 = (item1, item2) ->
  # returns true if all keys and values in item1 are present in item2
  if item1.itemtype != item2.itemtype
    return false
  if item1.data === item2.data
    return true
  return false

export makeLogAnalyzer = (orig_logs, options) ->
  if not options?
    options = {}
  if not options.ignored_activities?
    options.ignored_activities = []
  if not options.ignore_before_timestamp?
    options.ignore_before_timestamp = 0
  logs = filter_out_activities(orig_logs, options.ignored_activities, options.ignore_before_timestamp)

  @all_item_types = ~>
    return ['typeword', 'typeletter', 'balance', 'addition', 'subtraction', 'fillblank', 'fillblanksocial']

  @all_posters = ~>
    allusers = []
    allusers_set = {}
    all_classes = yamlfile.readFileSync('www/classes.yaml')
    for classname,classinfo of all_classes
      if not classinfo.users?
        continue
      for username in classinfo.users
        if not allusers_set[username]?
          allusers_set[username] = true
          allusers.push username
    return allusers

  @addAllItemTypes = (itemList) ~>
    allItemTypes = all_item_types()
    for itemtype in allItemTypes
      if itemtype not in Object.keys(itemList)
        itemList[itemtype] = 0
    return itemList

  @addAllPosters = (posterList, allPosters) ~>
    for poster in allPosters
      if poster not in Object.keys(posterList)
        posterList[poster] = 0
    return posterList
  @select_query = (query) ~>
    return filter_by_query(logs, query)

  @count_event_type = (event_type) ~>
    return select_query({event: event_type}).length

  @count_unique_activity_shares = ~>
    all_share_events = select_query({event: 'shareactivity'})
    unique_share_events = []
    for share_event in all_share_events
      matches = [x for x in unique_share_events when itemtype_and_data_matches_v2(share_event, x)]
      if matches.length == 0
        unique_share_events.push(share_event)
    return unique_share_events.length

  @target_users_for_sharing = ~>
    allPosters = all_posters()
    target_users = addAllPosters({}, allPosters)
    all_share_events = select_query({event: 'shareactivity'})
    for share_event in all_share_events
      share_target = share_event.targetuser
      if not share_target?
        continue
      if not target_users[share_target]?
        target_users[share_target] = 0
      target_users[share_target] += 1
    return target_users

  @posters_for_event_type = (event_type) ~>
    matching_events = select_query({event: event_type})
    allPosters = all_posters()
    posters = addAllPosters({}, allPosters)
    for evt in matching_events
      item = evt.item
      if not item? or not item.social?
        continue
      poster = item.social.poster
      if not poster?
        continue
      if not posters[poster]?
        posters[poster] = 0
      posters[poster] += 1
    return posters

  @itemtype_for_event_type = (event_type) ~>
    matching_events = select_query({event: event_type})
    item_types = addAllItemTypes({})
    for evt in matching_events
      item = evt.item
      if not item?
        continue
      itemtype = item.itemtype
      if not itemtype?
        continue
      if not item_types[itemtype]?
        item_types[itemtype] = 0
      item_types[itemtype] += 1  
    return item_types

  @app_open_duration = ~>
    open_events = select_query({event: 'app-still-open'})
    output = 0
    for evt in open_events
      if not evt.postinterval?
        continue
      output += evt.postinterval / 1000.0
    return output

  @app_active_duration = ~>
    open_events = select_query({event: 'app-still-open'})
    output = 0
    for evt in open_events
      if not evt.postinterval?
        continue
      if not evt.mostrecentclick?
        continue
      if not evt.currenttime?
        continue
      if Math.abs(evt.currenttime - evt.mostrecentclick) > evt.postinterval
        continue
      output += evt.postinterval / 1000.0
    return output

  @time_spent_on_activity_types = ~>
    open_events = select_query({event: 'app-still-open'})
    output = addAllItemTypes({})
    for evt in open_events
      if not evt.postinterval?
        continue
      if not evt.currentactivitytype?
        continue
      if not output[evt.currentactivitytype]?
        output[evt.currentactivitytype] = 0.0
      output[evt.currentactivitytype] += evt.postinterval / 1000.0
    return output

  @active_time_spent_on_activity_types = ~>
    open_events = select_query({event: 'app-still-open'})
    output = addAllItemTypes({})
    for evt in open_events
      if not evt.postinterval?
        continue
      if not evt.currentactivitytype?
        continue
      if not evt.postinterval?
        continue
      if not evt.mostrecentclick?
        continue
      if not evt.currenttime?
        continue
      if Math.abs(evt.currenttime - evt.mostrecentclick) > evt.postinterval
        continue
      if not output[evt.currentactivitytype]?
        output[evt.currentactivitytype] = 0.0
      output[evt.currentactivitytype] += evt.postinterval / 1000.0
    return output

  @getResults = ~>
    allPosters = all_posters()
    output = {}
    output['number of activities started'] = count_event_type('task-started')
    output['number of activities finished'] = count_event_type('task-finished')
    output['number of activities left'] = count_event_type('task-left')
    output['number of total share events'] = count_event_type('shareactivity')
    output['number of unique activities shared'] = count_unique_activity_shares()
    output['number of shares to each person in the class'] = target_users_for_sharing()
    output['identities of posters for activities started'] = posters_for_event_type('task-started')
    output['identities of posters for activities finished'] = posters_for_event_type('task-finished')
    output['identities of posters for activities left'] = posters_for_event_type('task-left')
    output['types of activities started'] = itemtype_for_event_type('task-started')
    output['types of activities finished'] = itemtype_for_event_type('task-finished')
    output['types of activities left'] = itemtype_for_event_type('task-left')
    output['total duration app has been open in seconds (within 10 seconds including idle time)'] = app_open_duration()
    output['total duration app has been active (excluding idle periods greater than 10 seconds)'] = app_active_duration()
    output['total time spent on each activity type (within 10 seconds including idle time)'] = addAllItemTypes(time_spent_on_activity_types())
    output['total active time spent on each activity type (excluding idle periods greater than 10 seconds)'] = addAllItemTypes(active_time_spent_on_activity_types())
    return output

  return this

export getLogAnalysisResults = (logs) ->
  #analyzer = makeLogAnalyzer(logs, {ignored_activities: ['admin']})
  analyzer = makeLogAnalyzer(logs, {ignored_activities: ['typeletter', 'bars', 'dots', 'readaloud', 'lettervideo', 'numbervideo','admin'], ignore_before_timestamp: 1444029300000})
  return analyzer.getResults()

export getLogAnalysisResultsAsString = (logs) ->
  return JSON.stringify(getLogAnalysisResults(logs), null, 2)
