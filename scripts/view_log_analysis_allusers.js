(function(){
  var fs, async, yamlfile, couchdb_url, getLogAnalysisResultsAsString, nano, main;
  fs = require('fs');
  async = require('async');
  yamlfile = require('yamlfile');
  couchdb_url = require('../couchdb_utils').couchdb_url;
  getLogAnalysisResultsAsString = require('../www/log-analysis').getLogAnalysisResultsAsString;
  nano = require('nano')(couchdb_url);
  main = function(){
    var username, allusers, allusers_set, classname, ref$, classinfo, i$, ref1$, len$;
    username = process.argv[2];
    if (!fs.existsSync('www')) {
      console.log('you need to run this script from the edufeed directory');
      return;
    }
    allusers = [];
    allusers_set = {};
    for (classname in ref$ = yamlfile.readFileSync('www/classes.yaml')) {
      classinfo = ref$[classname];
      if (classinfo.users == null) {
        continue;
      }
      for (i$ = 0, len$ = (ref1$ = classinfo.users).length; i$ < len$; ++i$) {
        username = ref1$[i$];
        if (allusers_set[username] == null) {
          allusers_set[username] = true;
          allusers.push(username);
        }
      }
    }
    return async.mapSeries(allusers, function(username, callback){
      var logsdb;
      console.log("fetching logs for " + username);
      logsdb = nano.use("logs_" + username);
      return logsdb.list({
        include_docs: true
      }, function(err, results){
        var logs, res$, i$, ref$, len$, x;
        if (err != null) {
          callback(null, {
            username: username,
            logs: []
          });
          return;
        }
        res$ = [];
        for (i$ = 0, len$ = (ref$ = results.rows).length; i$ < len$; ++i$) {
          x = ref$[i$];
          res$.push(x.doc);
        }
        logs = res$;
        return callback(null, {
          username: username,
          logs: logs
        });
      });
    }, function(all_errors, all_results){
      var all_logs, i$, len$, ref$, username, logs;
      all_logs = [];
      for (i$ = 0, len$ = all_results.length; i$ < len$; ++i$) {
        ref$ = all_results[i$], username = ref$.username, logs = ref$.logs;
        all_logs = all_logs.concat(logs);
        console.log(username);
        console.log(getLogAnalysisResultsAsString(logs));
      }
      console.log('aggregate results');
      return console.log(getLogAnalysisResultsAsString(all_logs));
    });
  };
  main();
}).call(this);
