export test_if_can_login = (username, password, callback) ->
  couchurl <- getCouchURL()
  db = new PouchDB("http://#{couchurl}/logs_#{username}")
  db.login username, password, (err, response) ->
    if err
      console.log err
      callback(false)
    else
      callback(true)

export get_couchdb_login = (callback) ->
  username <- getUsername()
  password <- getPassword()
  couchurl <- getCouchURL()
  callback {
    username: username
    password: password
    couchurl: couchurl
  }

db_cache = {}
remote_db_cache = {}
db_sync_handlers = {}
export getDb = (dbname, options) ->
  if typeof(dbname) != typeof('') # probably supplied a db instead of a dbname
    return dbname
  if not options?
    options = {}
  if db_cache[dbname]?
    return db_cache[dbname]
  db = db_cache[dbname] = new PouchDB(dbname)
  changes = db.changes({live: true})
  changes.on 'change', (change) ->
    if db_sync_handlers[dbname]?
      db_sync_handlers[dbname](change)
  params = getUrlParameters()
  sync = options.sync? or params.sync?
  replicatetoremote = options.replicatetoremote? or params.replicatetoremote?
  if sync or replicatetoremote
    get_couchdb_login (couchdb_login) ->
      {username, password, couchurl} = couchdb_login
      # remote_db = remote_db_cache[dbname] = new PouchDB("http://#{couchurl}/" + dbname, {auth: {username, password}})
      remote_db_url_string = "http://#{username}:#{password}@#{couchurl}/" + dbname
      console.log remote_db_url_string
      remote_db = remote_db_cache[dbname] = new PouchDB(remote_db_url_string)
      if sync
        db.sync(remote_db, {live: true})/*.on('change', (change) ->
          if db_sync_handlers[dbname]?
            db_sync_handlers[dbname](change)
        )*/.on('error', (err) ->
          console.log 'sync error'
          console.log err
        )
      else if replicatetoremote
        db.replicate.to(remote_db, {live: true})
        .on('error', (err) ->
          console.log 'replicatetoremote error'
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

