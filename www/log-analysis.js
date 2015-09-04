(function(){
  var item_matches_query, filter_by_query, filter_out_activities, makeLogAnalyzer, getLogAnalysisResults, getLogAnalysisResultsAsString, out$ = typeof exports != 'undefined' && exports || this;
  item_matches_query = function(item, query){
    var k, v;
    if (query == null) {
      return true;
    }
    for (k in query) {
      v = query[k];
      if (item[k] == null || v !== item[k]) {
        return false;
      }
    }
    return true;
  };
  out$.filter_by_query = filter_by_query = function(logs, query){
    var x;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = logs).length; i$ < len$; ++i$) {
        x = ref$[i$];
        if (item_matches_query(x, query)) {
          results$.push(x);
        }
      }
      return results$;
    }());
  };
  filter_out_activities = function(logs, ignored_activities){
    var x;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = logs).length; i$ < len$; ++i$) {
        x = ref$[i$];
        if (ignored_activities.indexOf(x.itemtype) === -1) {
          results$.push(x);
        }
      }
      return results$;
    }());
  };
  out$.makeLogAnalyzer = makeLogAnalyzer = function(orig_logs, options){
    var logs, this$ = this;
    if (options == null) {
      options = {};
    }
    if (options.ignored_activities == null) {
      options.ignored_activities = [];
    }
    logs = filter_out_activities(orig_logs, options.ignored_activities);
    this.select_query = function(query){
      return filter_by_query(logs, query);
    };
    this.count_event_type = function(event_type){
      return select_query({
        event: event_type
      }).length;
    };
    this.count_unique_activity_shares = function(){
      var all_share_events, unique_share_events, i$, len$, share_event, matches, res$, j$, len1$, x;
      all_share_events = select_query({
        event: 'shareactivity'
      });
      unique_share_events = [];
      for (i$ = 0, len$ = all_share_events.length; i$ < len$; ++i$) {
        share_event = all_share_events[i$];
        res$ = [];
        for (j$ = 0, len1$ = unique_share_events.length; j$ < len1$; ++j$) {
          x = unique_share_events[j$];
          if (itemtype_and_data_matches(share_event, x)) {
            res$.push(x);
          }
        }
        matches = res$;
        if (matches.length === 0) {
          unique_share_events.push(share_event);
        }
      }
      return unique_share_events.length;
    };
    this.target_users_for_sharing = function(){
      var target_users, all_share_events, i$, len$, share_event, share_target;
      target_users = {};
      all_share_events = select_query({
        event: 'shareactivity'
      });
      for (i$ = 0, len$ = all_share_events.length; i$ < len$; ++i$) {
        share_event = all_share_events[i$];
        share_target = share_event.targetuser;
        if (share_target == null) {
          continue;
        }
        if (target_users[share_target] == null) {
          target_users[share_target] = 0;
        }
        target_users[share_target] += 1;
      }
      return target_users;
    };
    this.posters_for_event_type = function(event_type){
      var matching_events, posters, i$, len$, evt, item, poster;
      matching_events = select_query({
        event: event_type
      });
      posters = {};
      for (i$ = 0, len$ = matching_events.length; i$ < len$; ++i$) {
        evt = matching_events[i$];
        item = evt.item;
        if (item == null || item.social == null) {
          continue;
        }
        poster = item.social.poster;
        if (poster == null) {
          continue;
        }
        if (posters[poster] == null) {
          posters[poster] = 0;
        }
        posters[poster] += 1;
      }
      return posters;
    };
    this.itemtype_for_event_type = function(event_type){
      var matching_events, item_types, i$, len$, evt, item, itemtype;
      matching_events = select_query({
        event: event_type
      });
      item_types = {};
      for (i$ = 0, len$ = matching_events.length; i$ < len$; ++i$) {
        evt = matching_events[i$];
        item = evt.item;
        if (item == null) {
          continue;
        }
        itemtype = item.itemtype;
        if (itemtype == null) {
          continue;
        }
        if (item_types[itemtype] == null) {
          item_types[itemtype] = 0;
        }
        item_types[itemtype] += 1;
      }
      return item_types;
    };
    this.app_open_duration = function(){
      var open_events, output, i$, len$, evt;
      open_events = select_query({
        event: 'app-still-open'
      });
      output = 0;
      for (i$ = 0, len$ = open_events.length; i$ < len$; ++i$) {
        evt = open_events[i$];
        if (evt.postinterval == null) {
          continue;
        }
        output += evt.postinterval / 1000.0;
      }
      return output;
    };
    this.app_active_duration = function(){
      var open_events, output, i$, len$, evt;
      open_events = select_query({
        event: 'app-still-open'
      });
      output = 0;
      for (i$ = 0, len$ = open_events.length; i$ < len$; ++i$) {
        evt = open_events[i$];
        if (evt.postinterval == null) {
          continue;
        }
        if (evt.mostrecentclick == null) {
          continue;
        }
        if (evt.currenttime == null) {
          continue;
        }
        if (Math.abs(evt.currenttime - evt.mostrecentclick) > evt.postinterval) {
          continue;
        }
        output += evt.postinterval / 1000.0;
      }
      return output;
    };
    this.time_spent_on_activity_types = function(){
      var open_events, output, i$, len$, evt;
      open_events = select_query({
        event: 'app-still-open'
      });
      output = {};
      for (i$ = 0, len$ = open_events.length; i$ < len$; ++i$) {
        evt = open_events[i$];
        if (evt.postinterval == null) {
          continue;
        }
        if (evt.currentactivitytype == null) {
          continue;
        }
        if (output[evt.currentactivitytype] == null) {
          output[evt.currentactivitytype] = 0.0;
        }
        output[evt.currentactivitytype] += evt.postinterval / 1000.0;
      }
      return output;
    };
    this.active_time_spent_on_activity_types = function(){
      var open_events, output, i$, len$, evt;
      open_events = select_query({
        event: 'app-still-open'
      });
      output = {};
      for (i$ = 0, len$ = open_events.length; i$ < len$; ++i$) {
        evt = open_events[i$];
        console.log(evt);
        if (evt.postinterval == null) {
          continue;
        }
        if (evt.currentactivitytype == null) {
          continue;
        }
        if (evt.postinterval == null) {
          continue;
        }
        if (evt.mostrecentclick == null) {
          continue;
        }
        if (evt.currenttime == null) {
          continue;
        }
        if (Math.abs(evt.currenttime - evt.mostrecentclick) > evt.postinterval) {
          continue;
        }
        if (output[evt.currentactivitytype] == null) {
          output[evt.currentactivitytype] = 0.0;
        }
        output[evt.currentactivitytype] += evt.postinterval / 1000.0;
      }
      return output;
    };
    this.getResults = function(){
      var output;
      output = {};
      output['number of activities started'] = count_event_type('task-started');
      output['number of activities finished'] = count_event_type('task-finished');
      output['number of activities left'] = count_event_type('task-left');
      output['number of total share events'] = count_event_type('shareactivity');
      output['number of unique activities shared'] = count_unique_activity_shares();
      output['number of shares to each person in the class'] = target_users_for_sharing();
      output['identities of posters for activities started'] = posters_for_event_type('task-started');
      output['identities of posters for activities finished'] = posters_for_event_type('task-finished');
      output['identities of posters for activities left'] = posters_for_event_type('task-left');
      output['types of activities started'] = itemtype_for_event_type('task-started');
      output['types of activities finished'] = itemtype_for_event_type('task-finished');
      output['types of activities left'] = itemtype_for_event_type('task-left');
      output['total duration app has been open in seconds (within 10 seconds including idle time)'] = app_open_duration();
      output['total duration app has been active (excluding idle periods greater than 10 seconds)'] = app_active_duration();
      output['total time spent on each activity type (within 10 seconds including idle time)'] = time_spent_on_activity_types();
      output['total active time spent on each activity type (excluding idle periods greater than 10 seconds)'] = active_time_spent_on_activity_types();
      return output;
    };
    return this;
  };
  out$.getLogAnalysisResults = getLogAnalysisResults = function(logs){
    var analyzer;
    analyzer = makeLogAnalyzer(logs, {
      ignored_activities: []
    });
    return analyzer.getResults();
  };
  out$.getLogAnalysisResultsAsString = getLogAnalysisResultsAsString = function(logs){
    return JSON.stringify(getLogAnalysisResults(logs), null, 2);
  };
}).call(this);
