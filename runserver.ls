require! {
  fs
  async
  os
  path
}

is_windows = os.platform() == 'win32'

{exec, which} = require 'shelljs'

{is_couchdb_running, does_user_exist, couchdb_server} = require './couchdb_utils'

if not fs.existsSync 'config.json'
  fs.writeFileSync 'config.json', JSON.stringify {
    couchdb: {
      database_dir: 'couchdata'
    }
    log: {
      file: 'couchdb_log.txt'
    }
  }

for command in ['gulp', 'node-dev'] # 'pouchdb-server'
  if not which command
    console.log "missing #{command} command"
    process.exit()

do ->
  if is_windows
    couchdb_dir = 'C:/Program Files/Apache Software Foundation/CouchDB/bin/'.split('/').join(path.sep)
    if fs.existsSync(couchdb_dir)
      process.env.PATH += ';' + couchdb_dir
      return
    couchdb_dir = 'C:/Program Files (x86)/Apache Software Foundation/CouchDB/bin/'.split('/').join(path.sep)
    if fs.existsSync(couchdb_dir)
      process.env.PATH += ';' + couchdb_dir
      return

exec 'gulp', {async: true}

couchserver_started = ->
  exec 'node scripts/create_users'
  exec 'node-dev app.ls', {async: true}

once_couchdb_running = (callback) ->
  is_couchdb_running (running) ->
    if running
      callback()
    else
      console.log 'waiting for couchdb to start running'
      setTimeout ->
        once_couchdb_running(callback)
      , 1000

is_couchdb_running (running) ->
  if running
    console.log 'using already-running couchdb instance at ' + couchdb_server
    couchserver_started()
    return
  if not which 'couchdb'
    console.log 'couchdb command not found'
    return
  exec 'couchdb', {async: true}
  once_couchdb_running ->
    console.log '====================================================='
    exec 'node scripts/getip'
    console.log '====================================================='
    couchserver_started()
