require! {
  fs
  yamlfile
  async
}

{is_couchdb_running, does_user_exist, signup_user, couchdb_server} = require '../couchdb_utils'

classes_file = 'www/classes.yaml'

create_user = (username, callback) ->
  does_user_exist username, (user_exists) ->
    if user_exists
	  console.log username + ' already exists.'
      callback(null, null)
      return
    console.log 'create_user ' + username
    signup_user username, username, ->
      callback(null, null)

create_users = ->
  console.log 'creating users'
  classes = yamlfile.readFileSync classes_file
  users = [classinfo.users for classname,classinfo of classes].reduce (++)
  console.log users
  async.eachSeries users, create_user

main = ->
  if not fs.existsSync(classes_file)
    console.log 'you need to run this script from the edufeed directory'
    return
  is_couchdb_running (isrunning) ->
    if not isrunning
      console.log 'couchdb not running'
      return
    else
      create_users()

main()
