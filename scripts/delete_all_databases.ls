require! {
  fs
  async
}

{couchdb_url} = require '../couchdb_utils'

nano = require('nano')(couchdb_url)

main = ->
  if not fs.existsSync('www')
    console.log 'you need to run this script from the edufeed directory'
    return
  (err, dblist) <- nano.db.list
  if err?
    console.log 'error occurred while listing databases'
    console.log err
    return
  async.eachSeries dblist, (dbname, ncallback) ->
    console.log 'deleting ' + dbname
    nano.db.destroy dbname, ->
      ncallback(null, null)
  , ->
    console.log 'done deleting all databases'
    process.exit()

main()
