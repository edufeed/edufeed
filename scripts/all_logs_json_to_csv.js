// Generated by LiveScript 1.3.1
(function(){
  var fs, json2csv, couchdb_url, getLogAnalysisResultsAsString, nano, main;
  fs = require('fs');
  json2csv = require('json2csv');
  couchdb_url = require('../couchdb_utils').couchdb_url;
  getLogAnalysisResultsAsString = require('../www/log-analysis').getLogAnalysisResultsAsString;
  nano = require('nano')(couchdb_url);
  main = function(){
    var filename;
    filename = process.argv[2];
    if (!fs.existsSync('www')) {
      console.log('you need to run this script from the edufeed directory');
      return;
    }
    if (filename == null) {
      console.log('you need to provide a filename as an argument');
      return;
    }
    return fs.readFile(filename + ".JSON", function(err, JSONfile){
      var results, fields, unnested_results, logs, i$, ref$, len$, group, groupLog, j$, ref1$, len1$, name, indivLog, k$, ref2$, len2$, key, l$, ref3$, len3$, nestedKey;
      if (err) {
        console.log(err);
        return;
      }
      results = JSON.parse(JSONfile);
      fields = [];
      unnested_results = {};
      fields.push('name');
      logs = [];
      for (i$ = 0, len$ = (ref$ = Object.keys(results)).length; i$ < len$; ++i$) {
        group = ref$[i$];
        if (group !== 'aggregate') {
          groupLog = results[group];
          for (j$ = 0, len1$ = (ref1$ = Object.keys(groupLog)).length; j$ < len1$; ++j$) {
            name = ref1$[j$];
            unnested_results = {};
            unnested_results['name'] = name;
            indivLog = groupLog[name];
            for (k$ = 0, len2$ = (ref2$ = Object.keys(indivLog)).length; k$ < len2$; ++k$) {
              key = ref2$[k$];
              if (typeof indivLog[key] === 'number') {
                unnested_results[key] = indivLog[key];
                if (!in$(key, fields)) {
                  fields.push(key);
                }
              } else {
                unnested_results[key] = {};
                for (l$ = 0, len3$ = (ref3$ = Object.keys(indivLog[key])).length; l$ < len3$; ++l$) {
                  nestedKey = ref3$[l$];
                  unnested_results[key + '.' + nestedKey] = indivLog[key][nestedKey];
                  if (!in$(key + '.' + nestedKey, fields)) {
                    fields.push(key + '.' + nestedKey);
                  }
                }
              }
            }
            logs.push(unnested_results);
          }
        }
      }
      return json2csv({
        data: logs,
        fields: fields
      }, function(err, csv){
        if (csv === 'undefined') {
          console.log('error');
        }
        return fs.writeFile(filename + ".csv", csv, function(err){
          if (err) {
            return console.log(err);
          } else {
            return console.log('file saved');
          }
        });
      });
    });
  };
  main();
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
