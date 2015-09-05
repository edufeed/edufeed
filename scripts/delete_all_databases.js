(function(){
  var fs, async, couchdb_url, nano, main;
  fs = require('fs');
  async = require('async');
  couchdb_url = require('../couchdb_utils').couchdb_url;
  nano = require('nano')(couchdb_url);
  main = function(){
    if (!fs.existsSync('www')) {
      console.log('you need to run this script from the edufeed directory');
      return;
    }
    return nano.db.list(function(err, dblist){
      if (err != null) {
        console.log('error occurred while listing databases');
        console.log(err);
        return;
      }
      return async.eachSeries(dblist, function(dbname, ncallback){
        console.log('deleting ' + dbname);
        return nano.db.destroy(dbname, function(){
          return ncallback(null, null);
        });
      }, function(){
        console.log('done deleting all databases');
        return process.exit();
      });
    });
  };
  main();
}).call(this);
