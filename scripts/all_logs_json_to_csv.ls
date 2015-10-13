require! {
  fs
  json2csv
}

{couchdb_url} = require '../couchdb_utils'
{getLogAnalysisResultsAsString} = require '../www/log-analysis'

nano = require('nano')(couchdb_url)

main = ->
  filename = process.argv[2]
  if not fs.existsSync('www')
    console.log 'you need to run this script from the edufeed directory'
    return
  if not filename?
    console.log 'you need to provide a filename as an argument'
    return

  (err, JSONfile) <- fs.readFile("#{filename}.JSON")
  if (err)
    console.log err
    return
  results = JSON.parse(JSONfile)
 
  fields = []
  unnested_results = {}
  # get rows
  fields.push('name')
  logs = []

  for group in Object.keys(results)
    if group != 'aggregate'
      groupLog = results[group]
      for name in Object.keys(groupLog)
        unnested_results = {}
        unnested_results['name'] = name
        
        indivLog = groupLog[name]
        for key in Object.keys(indivLog)
          if typeof indivLog[key] == 'number'
            unnested_results[key] = indivLog[key]
            if key not in fields
              fields.push(key)
          else
            unnested_results[key] = {}
            for nestedKey in Object.keys(indivLog[key])
              unnested_results[key + '.' + nestedKey] = indivLog[key][nestedKey]
              if key + '.' + nestedKey not in fields
                fields.push(key + '.' + nestedKey)
        logs.push(unnested_results)

  (err, csv) <- json2csv({data: logs, fields: fields})
  if (csv == 'undefined')
      console.log 'error'

  (err) <- fs.writeFile("#{filename}.csv", csv)
  if (err)
    console.log err
  else
    console.log('file saved');

main()
