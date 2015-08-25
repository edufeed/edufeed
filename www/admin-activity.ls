RegisterActivity {
  is: 'admin-activity'
  S: (pattern) ->
    return $(this.$$(pattern))
  ready: ->
    self = this
    username <- getUsername()
    password <- getPassword()
    couchserver <- getCouchURL()
    self.S('#usernameinput').val(username)
    self.S('#passwordinput').val(password)
    self.S('#couchserverinput').val(couchserver)
    self.S('#itemtypeinput').val 'typeword'
    self.S('#datainput').val jsyaml.safeDump({word: 'cat'}).trim()
    self.S('#socialinput').val jsyaml.safeDump({poster: username}).trim()
    self.S('#targetinput').val username.trim()
    all_users <- getAllUsers()
    fastlogin_buttons = $(self).find('#fastlogin_buttons')
    for let current_user in all_users
      new_fastlogin_button = $("<button class='btn btn-lg btn-primary'>").text(current_user).click ->
        self.S('#usernameinput').val(current_user)
        self.S('#passwordinput').val(current_user)
        self.setUsername()
      new_fastlogin_button.appendTo fastlogin_buttons
      fastlogin_buttons.append(' ')
  appcacheStatus: ->
    return <[ uncached idle checking downloading updateready ]>[window.applicationCache.status]
  reallySetUsername: (username, password, couchserver) ->
    setUsername username, ->
      setPassword password, ->
        setCouchURL couchserver, ->
          window.location.reload()
  deleteLocalFeedItemsDb: ->
    self = this
    username <- getUsername()
    deleteLocalDb "feeditems_#{username}", ->
      self.fire 'task-finished'
  deleteLocalFinishedItemsDb: ->
    self = this
    username <- getUsername()
    deleteLocalDb "finisheditems_#{username}", ->
      self.fire 'task-finished'
  deleteLocalLogsDb: ->
    self = this
    username <- getUsername()
    deleteLocalDb "logs_#{username}", ->
      self.fire 'task-finished'
  deleteLocalFeedItemsDbAllUsers: ->
    self = this
    all_users <- getAllUsers()
    async.eachSeries all_users, (username, callback) ->
      deleteLocalDb "feeditems_#{username}", ->
        callback(null, null)
    , ->
      self.fire 'task-finished'
  deleteLocalFinishedItemsDbAllUsers: ->
    self = this
    all_users <- getAllUsers()
    async.eachSeries all_users, (username, callback) ->
      deleteLocalDb "finisheditems_#{username}", ->
        callback(null, null)
    , ->
      self.fire 'task-finished'
  deleteLocalLogsDbAllUsers: ->
    self = this
    all_users <- getAllUsers()
    async.eachSeries all_users, (username, callback) ->
      deleteLocalDb "logs_#{username}", ->
        callback(null, null)
    , ->
      self.fire 'task-finished'
  clearLogs: ->
    self = this
    username <- getUsername()
    clearDb "logs_#{username}", ->
      self.fire 'task-finished'
  hideAdminActivity: ->
    console.log 'hideAdminActivity'
    this.fire 'hide-admin-activity'
    this.fire 'task-finished'
  setUsername: ->
    self = this
    username = this.S('#usernameinput').val().trim()
    password = this.S('#passwordinput').val().trim()
    couchserver = this.S('#couchserverinput').val().trim()
    let login_successful = true
    #test_if_can_login username, password, (login_successful) ->
      if not login_successful
        bootbox.confirm "Login was unsuccessful, are you sure you would like to update the stored username and password?", (certain) ->
          if certain
            self.reallySetUsername(username, password, couchserver)
          else
            getUsername (nusername) ->
              getPassword (npassword) ->
                getCouchURL (ncouchserver) ->
                  self.S('#usernameinput').val(nusername)
                  self.S('#passwordinput').val(npassword)
                  self.S('#couchserverinput').val(ncouchserver)
      else
        self.reallySetUsername(username, password, couchserver)
  makeFullScreen: ->
    ssfeed = $('side-scroll-feed')[0]
    rfs = document.body.mozRequestFullScreen || document.body.webkitRequestFullScreen || document.body.requestFullScreen
    if rfs
      rfs.call(ssfeed)
  clearItems: ->
    self = this
    username <- getUsername()
    clearDb "feeditems_#{username}", ->
      self.fire 'task-finished', self
  clearFinishedItems: ->
    self = this
    username <- getUsername()
    clearDb "finisheditems_#{username}", ->
      self.fire 'task-finished', self
  getSampleFeedItemCategories: ->
    return [k for k,v of getSampleFeedItems()]
  addSampleItems: (obj) ->
    self = this
    itemtype = 'defaults'
    if obj? and obj.srcElement? and obj.srcElement.dataItem?
      itemtype = obj.srcElement.dataItem
    #username <- getUsername()
    username = self.S('#targetinput').val().trim()
    items = getSampleFeedItems()[itemtype]
    async.each items, (item, callback) ->
      postItem "feeditems_#{username}", item, callback
    , (results) ->
      self.fire 'task-finished', self
  addCustomItem: ->
    console.log 'addCustomItem called'
    self = this
    itemtype = this.S('#itemtypeinput').val()
    if not itemtype? or itemtype.length == 0
      alert 'must specify itemtype'
      return
    getUsername (username) ->
      data_text = self.S('#datainput').val().trim()
      data = jsyaml.safeLoad data_text
      social_text = self.S('#socialinput').val().trim()
      social = jsyaml.safeLoad social_text
      target = self.S('#targetinput').val().trim()
      postItemToTarget target, {itemtype, data, social}, ->
        self.fire 'task-finished', self
      #postItem "feeditems_#{username}", {itemtype, data, social}, ->
      #  self.fire 'task-finished', self
  displayLogs: ->
    getlogs (logs) ~>
      this.S('#logdisplay').text JSON.stringify(logs, null, 2)
  displayErrors: ->
    geterrors (errors) ~>
      this.S('#errordisplay').text JSON.stringify(errors, null, 2)
  downloadLogs: ->
    getlogs (logs) ~>
      document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(logs, null, 2))
}
