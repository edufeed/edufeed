(function(){
  var getActivityName, getActivityTag, loginfo, addlog, getlogs, printlogs, printloganalysis, out$ = typeof exports != 'undefined' && exports || this;
  out$.getActivityName = getActivityName = function(){
    var activity, children, tag;
    activity = $('#activity');
    if (activity != null && activity.children != null) {
      children = activity.children();
      if (children != null && children.length > 0) {
        tag = children[0];
        if (tag.tagName != null) {
          return tag.tagName.toLowerCase().split('-activity').join('');
        }
      }
    }
    return 'side-scroll-feed';
  };
  out$.getActivityTag = getActivityTag = function(){
    var activity_name;
    activity_name = getActivityName();
    if (activity_name === 'side-scroll-feed') {
      return $('side-scroll-feed')[0];
    } else {
      return $('#activity').children()[0];
    }
  };
  loginfo = {};
  out$.addlog = addlog = function(postdata, callback){
    var output;
    output = import$({}, postdata);
    return getUsername(function(username){
      var db, activity_name, activity_tag, ref$, itemtype, data, social;
      db = getDb("logs_" + username, {
        replicatetoremote: true
      });
      if (output.username == null) {
        output.username = username;
      }
      output.posttime = Date.now();
      if (loginfo.sessionstart == null) {
        loginfo.sessionstart = Date.now();
      }
      activity_name = getActivityName();
      activity_tag = getActivityTag();
      if (activity_name === 'side-scroll-feed') {
        output.itemtype = 'side-scroll-feed';
        output.feeditems = activity_tag.items;
      } else {
        ref$ = activity_tag.getalldata(), itemtype = ref$.itemtype, data = ref$.data, social = ref$.social;
        output.itemtype = itemtype;
        output.data = data;
        output.social = social;
      }
      return postItem(db, output, function(){
        if (callback != null) {
          return callback();
        }
      });
    });
  };
  out$.getlogs = getlogs = function(callback){
    return getUsername(function(username){
      var db;
      db = getDb("logs_" + username);
      return db.allDocs({
        include_docs: true
      }).then(function(docs){
        var x;
        return callback((function(){
          var i$, ref$, len$, results$ = [];
          for (i$ = 0, len$ = (ref$ = docs.rows).length; i$ < len$; ++i$) {
            x = ref$[i$];
            results$.push(x.doc);
          }
          return results$;
        }()));
      });
    });
  };
  out$.printlogs = printlogs = function(query){
    return getlogs(function(logs){
      var matching_logs;
      matching_logs = filter_by_query(logs, query);
      return console.log(JSON.stringify(matching_logs, null, 2));
    });
  };
  out$.printloganalysis = printloganalysis = function(){
    return getlogs(function(logs){
      return console.log(getLogAnalysisResultsAsString(logs));
    });
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
