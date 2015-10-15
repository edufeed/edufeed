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
  noIgnoredActivities = logs.filter (x) ->
    if ignored_activities.indexOf(x.itemtype) != -1
      return false
    if x.item? and x.item.itemtype? and ignored_activities.indexOf(x.item.itemtype) != -1
      return false
    return true
  return [x for x in noIgnoredActivities when x.updatetime >= ignore_before_timestamp]

filter_out_duplicate_close = (logs) ->
  expecting_close = false
  last_closed = null
  output = []
  sorted_logs = logs[to].sort (x, y) ->
    x.posttime - y.posttime
  for evt in logs
    {event} = evt
    if event == 'task-started'
      expecting_close = true
    if ['task-left', 'task-finished'].indexOf(event) != -1
      if not expecting_close
        continue
        #if evt.item? and evt.item.itemtype? and evt.item.itemtype == last_closed
        #  continue
      expecting_close = false
      #if evt.item? and evt.item.itemtype?
      #  last_closed = evt.item.itemtype
    output.push evt
  return output

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
  if not options.ignore_duplicate_close?
    options.ignore_duplicate_close = false
  logs = filter_out_activities(orig_logs, options.ignored_activities, options.ignore_before_timestamp)
  if options.ignore_duplicate_close
    logs = filter_out_duplicate_close(logs)

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

  @countTabletPosts = (posterList) ~>
    totalTabletPosts = 0
    for key in Object.keys(posterList)
      if key == 'tablet'
        totalTabletPosts += posterList[key]
    return totalTabletPosts

  @countTeacherPosts = (posterList) ~>
    totalTeacherPosts = 0
    for key in Object.keys(posterList)
      if key == 'teacherb' or key == 'teacherc'
        totalTeacherPosts += posterList[key]
    return totalTeacherPosts

  @countClassmatePosts = (posterList) ~>
    totalClassmatePosts = 0
    for key in Object.keys(posterList)
      if key != 'tablet' and key != 'teacherb' and key != 'teacherc'
        totalClassmatePosts += posterList[key]
    return totalClassmatePosts

  @calculatePercentage = (numer, denom) ~>
    if denom == 0
      return 0
    else
      return numer/denom

  @calculatePercentageInDict = (activityDict, total) ~>
    percentage = {}
    for key in Object.keys(activityDict)
      percentage[key] = calculatePercentage(activityDict[key], total)
    return percentage

  @calculatePercentagesOfStarted = (finishedOrLeft, started) ~>
    percentage = {}
    for key in Object.keys(started)
      if started[key] != 0 and finishedOrLeft[key]?
        percentage[key] = finishedOrLeft[key]/started[key]
      else
        percentage[key] = 0
    return percentage

  @getResults = ~>
    allPosters = all_posters()
    output = {}

    # Activities started, finished, and left (i.e., not finished)
    numActivitiesStartedBySystem = count_event_type('task-started')
    numActivitiesFinished = count_event_type('task-finished')
    numActivitiesLeft = count_event_type('task-left')
    numActivitiesStarted = numActivitiesFinished + numActivitiesLeft
    diff = numActivitiesStartedBySystem - numActivitiesStarted
    activeTime = app_active_duration()
    output['number Activities Started As Reported By System'] = numActivitiesStartedBySystem
    output['number Activities Started'] = numActivitiesStarted
    output['number Activities Finished'] = numActivitiesFinished
    output['number Activities Left'] = numActivitiesLeft
    output['difference between started and finished or left activities'] = diff
    output['percent Of Started That Were Finished'] = numActivitiesFinished/numActivitiesStarted
    output['percent Of Started That Were Left'] = numActivitiesLeft/numActivitiesStarted
    output['normalized Num Activities Started Over Active Time'] = numActivitiesStarted/activeTime
    output['normalized Num Activities Left Over Active Time'] = numActivitiesLeft/activeTime
    output['normalized num Activities Finished Over Active Time'] = numActivitiesFinished/activeTime
    
    # Share events
    output['num Total Share Events'] = count_event_type('shareactivity')
    output['number of unique activities shared'] = count_unique_activity_shares()
    output['number of shares to each person in the class'] = target_users_for_sharing()
    
    # Identities of the posters for each activity started
    postersOfStartedActivities = posters_for_event_type('task-started')
    classmatePostedStarted = countClassmatePosts(postersOfStartedActivities)
    teacherPostedStarted = countTeacherPosts(postersOfStartedActivities)
    tabletPostedStarted = countTabletPosts(postersOfStartedActivities)-diff #Hack to not count the admin starts?
    output['posters For Activities Started'] = postersOfStartedActivities
    output['classmate Posted Activites Started'] = classmatePostedStarted
    output['teacher Posted Activities Started'] = teacherPostedStarted
    output['tab Posted Activities Started'] = tabletPostedStarted

    # Of all activities started, percent of them started by each poster
    output['percent Classmate Posted Activities Started'] = classmatePostedStarted/numActivitiesStarted
    output['percent Teacher Posted Activities Started'] = teacherPostedStarted/numActivitiesStarted
    output['percent Tab Posted Activites Started'] = tabletPostedStarted/numActivitiesStarted

    # Identities of the posters for each activity finished
    postersOfFinishedActivities = posters_for_event_type('task-finished')
    classmatePostedFinished = countClassmatePosts(postersOfFinishedActivities)
    teacherPostedFinished = countTeacherPosts(postersOfFinishedActivities)
    tabletPostedFinished = countTabletPosts(postersOfFinishedActivities)

    output['posters For Activities Finished'] = postersOfFinishedActivities
    output['total Classmate Posted Activities Finished'] = classmatePostedFinished
    output['total Teacher Posted Activities Finished'] = teacherPostedFinished
    output['total Tab Posted Activities Finished'] = tabletPostedFinished

    # Percentage of the poster activities started that were finished
    output['percent Classmate Posted Activities Finished'] = calculatePercentage(classmatePostedFinished,classmatePostedStarted)
    output['percent Teacher Posted Activities Finished'] = calculatePercentage(teacherPostedFinished,teacherPostedStarted)
    output['percent Tab Posted Activities Finished'] = calculatePercentage(tabletPostedFinished,tabletPostedStarted)

    # Identities of the posters for each activity left (i.e., not finished)
    postersOfLeftActivities = posters_for_event_type('task-left')
    classmatePostedLeft = countClassmatePosts(postersOfLeftActivities)
    teacherPostedLeft = countTeacherPosts(postersOfLeftActivities)
    tabletPostedLeft = countTabletPosts(postersOfLeftActivities)

    output['posters For Activities Left'] = postersOfLeftActivities
    output['total Classmate Posted Activities Left'] = classmatePostedLeft
    output['total Teacher Posted Activities Left'] = teacherPostedLeft
    output['total Tab Posted Activities Left'] = tabletPostedLeft

    # Percentage of the poster activities started that were left
    output['percent Classmate Posted Activities Left'] = calculatePercentage(classmatePostedLeft,classmatePostedStarted)
    output['percent Teacher Posted Activities Left'] = calculatePercentage(teacherPostedLeft,teacherPostedStarted)
    output['percent Tab Posted Activities Left'] = calculatePercentage(tabletPostedLeft,tabletPostedStarted)

    # By Activity Type
    activityTypesStarted = itemtype_for_event_type('task-started')
    output['total Num Of Each Activity Type Started'] = activityTypesStarted
    output['percent Of Each Activity Type Started Over All Started'] = calculatePercentageInDict(activityTypesStarted, numActivitiesStarted)

    activityTypesFinished = itemtype_for_event_type('task-finished')
    output['total Num Of Each Activity Type Finished'] = activityTypesFinished
    # Percentage of each activity type started that were finished
    output['percent Of Started Activity Type Finished'] = calculatePercentagesOfStarted(activityTypesFinished, activityTypesStarted)

    activityTypesLeft = itemtype_for_event_type('task-left')
    output['total Num Of Each Activity Type Left'] = activityTypesLeft
    # Percentage of each activity type started that were left
    output['percent Of Started Activity Type Left'] = calculatePercentagesOfStarted(activityTypesLeft, activityTypesStarted)

    # 'total duration app has been open in seconds (within 10 seconds including idle time)'
    output['total Open Time'] = app_open_duration()

    # 'total duration app has been active (excluding idle periods greater than 10 seconds)'
    output['total Active Time'] = activeTime

    # 'total time spent on each activity type (within 10 seconds including idle time)'
    output['total Activity Open Time'] = addAllItemTypes(time_spent_on_activity_types())
 
    activityActiveTime = addAllItemTypes(active_time_spent_on_activity_types())
    # 'total active time spent on each activity type (excluding idle periods greater than 10 seconds)'
    output['total Activity Active Time'] = activityActiveTime
    output['percent Active Time per Activity'] = calculatePercentageInDict(activityActiveTime, activeTime)

    return output

  return this

export getLogAnalysisResults = (logs) ->
  #analyzer = makeLogAnalyzer(logs, {ignored_activities: ['admin']})
  analyzer = makeLogAnalyzer(logs, {ignored_activities: ['typeletter', 'bars', 'dots', 'readaloud', 'lettervideo', 'numbervideo','admin'], ignore_before_timestamp: 1444029300000, ignore_duplicate_close: true})
  return analyzer.getResults()

export getLogAnalysisResultsAsString = (logs) ->
  return JSON.stringify(getLogAnalysisResults(logs), null, 2)
