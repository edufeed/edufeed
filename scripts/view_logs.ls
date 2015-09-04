require! {
  fs
}

{couchdb_url} = require '../couchdb_utils'

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
  console.log JSON.stringify(logs, null, 2)

main()
