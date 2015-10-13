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
 
  rows = []
  fields = []
  unnested_results = {}
  # get rows
  unnested_results['name'] = filename
  fields.push('name')

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

  (err) <- fs.writeFile("#{filename}.csv", csv)
  if (err)
    console.log err
  else
    console.log('file saved');

main()
