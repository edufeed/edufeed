require! {
  fs
}

{exec, which} = require 'shelljs'

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

exec 'pouchdb-server', {async: true}
exec 'gulp', {async: true}
exec 'node-dev app.ls', {async: true}