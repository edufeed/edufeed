require! {
  restler
  crypto
  getsecret
}

couchdb_server = getsecret('couchdb_server')
couchdb_user = getsecret('couchdb_user')
couchdb_password = getsecret('couchdb_password')
couchdb_url = "https://#{couchdb_user}:#{couchdb_password}@#{couchdb_server}/"
if not couchdb_server?
  couchdb_server = '127.0.0.1:5984'
  couchdb_url = 'http://127.0.0.1:5984/'

export couchdb_server
export couchdb_url


nano = require('nano')(couchdb_url)

couch_put = (url, data, callback) ->
  restler.putJson(couchdb_url + url, data).on 'complete', (data, response) ->
    callback(data)

export signup_couchdb = (username, password, callback) ->
  users = nano.use('_users')
  (err1) <- users.insert {
    _id: "org.couchdb.user:#{username}"
    name: username
    type: 'user'
    roles: ["logs_#{username}", "feeditems_#{username}"]
    password: password
  }
  if err1?
    console.log err1
  (err2) <- nano.db.create("logs_#{username}")
  if err2?
    console.log err2
  (err3) <- couch_put "logs_#{username}/_security", {
    members: {
      names: [username]
      roles: ["logs_#{username}"]
    }
  }
  if err3?
    console.log err3
  (err4) <- nano.db.create("feeditems_#{username}")
  if err4?
    console.log err4
  (err5) <- couch_put "feeditems_#{username}/_security", {
    members: {
      names: [username]
      roles: ["feeditems_#{username}"]
    }
  }
  if err5?
    console.log err5
  if callback?
    callback()

export signup_cloudant = (username, password, callback) ->
  users = nano.use('_users')
  salt = crypto.randomBytes(16).toString('hex')
  hash = crypto.createHash('sha1')
  hash.update(password + salt)
  password_sha = hash.digest('hex')
  (err1) <- users.insert {
    _id: "org.couchdb.user:#{username}"
    name: username
    type: 'user'
    roles: ["logs_#{username}", "feeditems_#{username}"]
    password_sha: password_sha
    salt: salt
  }
  if err1?
    console.log err1
  (err2) <- nano.db.create("logs_#{username}")
  if err2?
    console.log err2
  (err3) <- couch_put "logs_#{username}/_security", {
    couchdb_auth_only: true
    members: {
      names: [username]
      roles: ["logs_#{username}"]
    }
  }
  if err3?
    console.log err3
  (err4) <- nano.db.create("feeditems_#{username}")
  if err4?
    console.log err4
  (err5) <- couch_put "feeditems_#{username}/_security", {
    couchdb_auth_only: true
    members: {
      names: [username]
      roles: ["feeditems_#{username}"]
    }
  }
  if err5?
    console.log err5
  if callback?
    callback()
