require! {
  fs
  async
  yamlfile
}

{couchdb_url} = require '../couchdb_utils'
{getLogAnalysisResultsAsString} = require '../www/log-analysis'

nano = require('nano')(couchdb_url)

main = ->
  username = process.argv[2]
  if not fs.existsSync('www')
    console.log 'you need to run this script from the edufeed directory'
    return
  allusers = []
  allusers_set = {}
  for classname,classinfo of yamlfile.readFileSync('www/classes.yaml')
    if not classinfo.users?
      continue
    for username in classinfo.users
      if not allusers_set[username]?
        allusers_set[username] = true
        allusers.push username
  (all_errors, all_results) <- async.mapSeries allusers, (username, callback) ->
    console.log "fetching logs for #{username}"
    logsdb = nano.use("logs_#{username}")
    (err, results) <- logsdb.list({include_docs: true})
    if err?
      callback(null, {username, logs: []})
      return
    logs = [x.doc for x in results.rows]
    callback(null, {username, logs})
  all_logs = []
  for {username,logs} in all_results
    all_logs = all_logs.concat logs
    console.log username
    console.log getLogAnalysisResultsAsString(logs)
  console.log 'aggregate results'
  console.log getLogAnalysisResultsAsString(all_logs)

main()
