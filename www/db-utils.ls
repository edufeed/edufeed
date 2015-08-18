export test_if_can_login = (username, password, callback) ->
  couchurl <- getCouchURL()
  pouchOpts = {
    skipSetup: true
  }
  use_https = couchurl.indexOf('cloudant.com') != -1
  if use_https
    db = new PouchDB("https://#{couchurl}/logs_#{username}", pouchOpts)
  else
    db = new PouchDB("http://#{couchurl}/logs_#{username}", pouchOpts)
  ajaxOpts = {
    headers: {
      Authorization: 'Basic ' + window.btoa(username + ':' + password)
    }
  }
  db.login username, password, ajaxOpts, (err, response) ->
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
  (local_username) <- getUsername()
  if typeof(dbname) != typeof('') # probably supplied a db instead of a dbname
    return dbname
  if not options?
    options = {}
  if db_cache[dbname]?
    return db_cache[dbname]
  db = db_cache[dbname] = new PouchDB(dbname, {auto_compaction: true})
  #couch_options = {live: true, retry: true, continuous: true, heartbeat: 3000, timeout: 3000}
  couch_options = {live: true, retry: true, continuous: true, batch_size: 500, batches_limit: 100, heartbeat: 3000, timeout: 3000}
  changes = db.changes(couch_options)
  changes.on 'change', (change) ->
    if db_sync_handlers[dbname]?
      db_sync_handlers[dbname](change)
  params = getUrlParameters()
  sync = options.sync? or params.sync? or dbname.indexOf('feeditems_' + local_username) == 0
  replicatetoremote = options.replicatetoremote? or params.replicatetoremote? or dbname.indexOf('logs_') == 0 or (dbname.indexOf('feeditems_') == 0 and !sync)
  if sync or replicatetoremote
    get_couchdb_login (couchdb_login) ->
      {username, password, couchurl} = couchdb_login
      use_https = couchurl.indexOf('cloudant.com') != -1
      if use_https
        remote_db_url_string = "https://#{username}:#{password}@#{couchurl}/" + dbname
      else
        remote_db_url_string = "http://#{username}:#{password}@#{couchurl}/" + dbname
      console.log remote_db_url_string
      remote_db = remote_db_cache[dbname] = new PouchDB(remote_db_url_string)
      if sync
        db.sync(remote_db, couch_options)/*.on('change', (change) -> # {live: true, retry: true, continuous: true}
          if db_sync_handlers[dbname]?
            db_sync_handlers[dbname](change)
        )*/.on('error', (err) ->
          console.log 'sync error'
          console.log err
        )
      else if replicatetoremote
        db.replicate.to(remote_db, couch_options)
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
  console.log 'postItem called: '
  console.log dbname
  console.log item
  db = getDb(dbname)
  new_item = {} <<< item
  if not new_item._id?
    new_item._id = makeUUID()
  db.put new_item, (err, res) ->
    if callback?
      callback(err, res)

export postItemToTarget = (target, item, callback) ->
  console.log 'postItemToTarget before getClasses'
  getClasses (classes) ->
    console.log 'postItemToTarget'
    console.log target
    if not classes[target]?
      # is username
      postItem "feeditems_#{target}", item, callback
      return
    users = classes[target].users
    async.eachSeries users, (username, ncallback) ->
      postItem "feeditems_#{username}", item, ncallback
    , ->
      if callback?
        callback()
