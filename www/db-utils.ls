db_cache = {}
remote_db_cache = {}
db_sync_handlers = {}
export getDb = (dbname) ->
  if db_cache[dbname]?
    return db_cache[dbname]
  db = db_cache[dbname] = new PouchDB(dbname)
  changes = db.changes({live: true})
  changes.on 'change', (change) ->
    if db_sync_handlers[dbname]?
      db_sync_handlers[dbname](change)
  params = getUrlParameters()
  if params.sync?
    username = params.username ? 'guestuser'
    password = params.password ? 'guestpassword'
    remote_db = remote_db_cache[dbname] = new PouchDB('http://edufeed.iriscouch.com/' + dbname, {auth: {username, password}})
    db.sync(remote_db, {live: true})/*.on('change', (change) ->
      if db_sync_handlers[dbname]?
        db_sync_handlers[dbname](change)
    )*/.on('error', (err) ->
      console.log 'sync error'
      console.log err
    )
  return db

export setSyncHandler = (dbname, callback) ->
  db_sync_handlers[dbname] = callback

export getItems = (dbname, callback) ->
  db = getDb(dbname)
  db.allDocs({include_docs: true}).then (data) ->
    #callback [x.doc for x in data.rows when not x.doc._deleted]
    callback [x.doc for x in data.rows]

export clearDb = (dbname, callback) ->
  db = getDb(dbname)
  db.allDocs({include_docs: true}).then (data) ->
    async.each data.rows, (x, callback) ->
      x.doc._deleted = true
      db.put x.doc, callback
    , (results) ->
      if callback?
        callback(null, results)

padWithZeros = (num, target_length) ->
  current = num.toString()
  zeros_to_add = target_length - current.length
  return ('0' * zeros_to_add) + current

prevUUID = {time: 0, idx: 0}
export makeUUID = ->
  curtime = Date.now()
  if curtime == prevUUID.time
    prevUUID.idx += 1
  else
    prevUUID.time = curtime
    prevUUID.idx = 0
  return padWithZeros(prevUUID.time, 13) ++ padWithZeros(prevUUID.idx, 7)

export postItem = (dbname, item, callback) ->
  db = getDb(dbname)
  new_item = {} <<< item
  if not new_item._id?
    new_item._id = makeUUID()
  db.put new_item, (err, res) ->
    if callback?
      callback(err, res)
