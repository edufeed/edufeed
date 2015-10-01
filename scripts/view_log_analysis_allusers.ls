require! {
  fs
  async
  yamlfile
}

{couchdb_url} = require '../couchdb_utils'
{getLogAnalysisResultsAsString, getLogAnalysisResults} = require '../www/log-analysis'

nano = require('nano')(couchdb_url)

main = ->
  username = process.argv[2]
  if not fs.existsSync('www')
    console.log 'you need to run this script from the edufeed directory'
    return
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
  (all_errors, all_results) <- async.mapSeries allusers, (username, callback) ->
    console.log "fetching logs for #{username}"
    logsdb = nano.use("logs_#{username}")
    (err, results) <- logsdb.list({include_docs: true})
    if err?
      callback(null, {username, logs: []})
      return
    logs = [x.doc for x in results.rows]
    callback(null, {username, logs})
  output = {
    users: {}
    classes: {}
    aggregate: {}
  }
  username_to_logs = {}
  for {username,logs} in all_results
    username_to_logs[username] = logs
  for {username,logs} in all_results
    output.users[username] = getLogAnalysisResults(logs)
  all_logs = []
  for {logs} in all_results
    all_logs = all_logs.concat logs
  output.aggregate = getLogAnalysisResults(all_logs)
  for classname,classinfo of all_classes
    if not classinfo.users?
      continue
    class_logs = []
    for username in classinfo.users
      class_logs = class_logs.concat username_to_logs[username]
    output.classes[classname] = getLogAnalysisResults(class_logs)
  console.log JSON.stringify(output, null, 2)

main()
