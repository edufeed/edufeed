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

export clearDb = (dbname) ->
  db = getDb(dbname)
  db.allDocs({include_docs: true}).then (data) ->
    for x in data.rows
      x.doc._deleted = true
      db.put(x.doc)
