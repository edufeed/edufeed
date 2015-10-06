require! {
  fs
  async
}

{couchdb_url} = require '../couchdb_utils'

nano = require('nano')(couchdb_url)

# Couchdb server names
origServer = '' #'edufeed'
replicateServer = '' #'edufeedindia'

main = ->
  if not fs.existsSync('www')
    console.log 'you need to run this script from the edufeed directory'
    return
  if origServer == '' or replicateServer == ''
    console.log 'you need to specify the original and/or replicate couchdb server names in the script'
  (err, dblist) <- nano.db.list
  if err?
    console.log 'error occurred while listing databases'
    console.log err
    return
  async.eachSeries dblist, (dbname, ncallback) ->
    console.log 'replicating ' + dbname
    i = dbname.indexOf('_')
    username = dbname.slice(i+1, dbname.length)
    origdb = 'http://' + username + ':' + username + '@' + origServer + '.cloudant.com/' + dbname
    replicatedb = 'http://' + username + ':' + username + '@' + replicateServer + '.cloudant.com/' + dbname
    nano.db.replicate origdb, replicatedb, ->
      ncallback(null, null)
  , ->
    console.log 'done replicating all databases'
    process.exit()

main()
