require! {
  fs
  json2csv
}

{couchdb_url} = require '../couchdb_utils'
{getLogAnalysisResultsAsString} = require '../www/log-analysis'

nano = require('nano')(couchdb_url)

main = ->
  username = process.argv[2]
  if not fs.existsSync('www')
    console.log 'you need to run this script from the edufeed directory'
    return
  if not username?
    console.log 'you need to provide a username as an argument'
    return

  logsdb = nano.use("logs_#{username}")
  (err, results) <- logsdb.list({include_docs: true})
  if err?
    console.log 'error occurred while reading the logs database:'
    console.log err
    return
  logs = [x.doc for x in results.rows]
  console.log getLogAnalysisResultsAsString(logs)
  results_string = getLogAnalysisResultsAsString(logs)
  results = JSON.parse(results_string)
  (err) <- fs.writeFile("logs/logs_#{username}.JSON", results_string)
  if err
    console.log err
  else
    console.log("log created for #{username}")
  
  #(err, JSONfile) <- fs.readFile("logs/logs_#{username}.JSON")
  #results = JSON.parse(JSONfile)
 
  fields = []
  unnested_results = {}
  # get keys
  for key in Object.keys(results)
    if typeof results[key] == 'number'
      unnested_results[key] = results[key]
      fields.push(key)
    else
      unnested_results[key] = {}
      for nestedKey in Object.keys(results[key])
        unnested_results[key + '.' + nestedKey] = results[key][nestedKey]
        fields.push(key + '.' + nestedKey)

  (err, csv) <- json2csv({data: unnested_results, fields: fields})
  if (csv == 'undefined')
      console.log 'error'

  (err) <- fs.writeFile("logs/#{username}.csv", csv)
  if (err)
    console.log err
  else
    console.log('file saved');

main()
