// Generated by LiveScript 1.3.1
(function(){
  var fs, couchdb_url, getLogAnalysisResultsAsString, nano, main;
  fs = require('fs');
  couchdb_url = require('../couchdb_utils').couchdb_url;
  getLogAnalysisResultsAsString = require('../www/log-analysis').getLogAnalysisResultsAsString;
  nano = require('nano')(couchdb_url);
  main = function(){
    var username, logsdb;
    username = process.argv[2];
    if (!fs.existsSync('www')) {
      console.log('you need to run this script from the edufeed directory');
      return;
    }
    if (username == null) {
      console.log('you need to provide a username as an argument');
      return;
    }
    logsdb = nano.use("logs_" + username);
    return logsdb.list({
      include_docs: true
    }, function(err, results){
      var logs, res$, i$, ref$, len$, x, logsString;
      if (err != null) {
        console.log('error occurred while reading the logs database:');
        console.log(err);
        return;
      }
      res$ = [];
      for (i$ = 0, len$ = (ref$ = results.rows).length; i$ < len$; ++i$) {
        x = ref$[i$];
        res$.push(x.doc);
      }
      logs = res$;
      logsString = getLogAnalysisResultsAsString(logs);
      console.log(logsString);
      return fs.writeFile("logs_" + username + ".JSON", logsString, function(err){
        if (err) {
          return console.log(err);
        } else {
          return console.log("log created for " + username);
        }
      });
    });
  };
  main();
}).call(this);
