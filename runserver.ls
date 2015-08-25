require! {
  fs
  async
}

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

for command in ['pouchdb-server', 'gulp', 'node-dev']
  if not which command
    console.log "missing #{command} command"
    process.exit()

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
  exec 'pouchdb-server', {async: true}
  once_couchdb_running ->
    console.log '====================================================='
    exec 'node scripts/getip'
    console.log '====================================================='
    couchserver_started()
