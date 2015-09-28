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
    skipsharescreen <- getBoolParam('skipsharescreen')
    hidesharebutton <- getBoolParam('hidesharebutton')
    hidehelpbutton <- getBoolParam('hidehelpbutton')
    maketransparentbutton <- getBoolParam('maketransparentbutton')
    showposterthumbnail <- getBoolParam('showposterthumbnail')
    controlcondition <- getBoolParam('controlcondition')
    condition1 <- getBoolParam('condition1')
    condition2 <- getBoolParam('condition2')
    suggestionformula <- getParam('suggestionformula')
    self.S('#skipsharescreen').prop('checked', skipsharescreen)
    self.S('#hidesharebutton').prop('checked', hidesharebutton)
    self.S('#hidehelpbutton').prop('checked', hidehelpbutton)
    self.S('#maketransparentbutton').prop('checked', maketransparentbutton)
    self.S('#showposterthumbnail').prop('checked', showposterthumbnail)
    self.S('#controlcondition').prop('checked', controlcondition)
    self.S('#condition1').prop('checked', condition1)
    self.S('#condition2').prop('checked', condition2)
    all_users <- getAllUsers()
    fastlogin_buttons = $(self).find('#fastlogin_buttons')
    for let current_user in all_users
      new_fastlogin_button = $("<button class='btn btn-lg btn-primary'>").text(current_user).click ->
        self.S('#usernameinput').val(current_user)
        self.S('#passwordinput').val(current_user)
        self.setUsername()
      new_fastlogin_button.appendTo fastlogin_buttons
      fastlogin_buttons.append(' ')
    console.log suggestionformula
    setTimeout ->
      if suggestionformula? and suggestionformula.length > 0
        self.S('#selectsuggestionformula').val(suggestionformula)
      else
        #self.S('#selectsuggestionformula').val('default') 
        /*hack to default to one_more_of_the_sametype*/
        self.S('#selectsuggestionformula').val('one_more_of_the_sametype') 
    , 0
  appcacheStatus: ->
    return <[ uncached idle checking downloading updateready ]>[window.applicationCache.status]
  getSuggestionFormulas: ->
    return [k for k,v of getTaskSuggestionFormulas()]
  reallySetUsername: (username, password, couchserver) ->
    setUsername username, ->
      setPassword password, ->
        setCouchURL couchserver, ->
          window.location.reload()
  deleteLocalFeedItemsDb: ->
    self = this
    username <- getUsername()
    deleteLocalDb "feeditems_#{username}", ->
      self.fire 'task-left', self
  deleteLocalFinishedItemsDb: ->
    self = this
    username <- getUsername()
    deleteLocalDb "finisheditems_#{username}", ->
      self.fire 'task-left', self
  deleteLocalLogsDb: ->
    self = this
    username <- getUsername()
    deleteLocalDb "logs_#{username}", ->
      self.fire 'task-left', self
  deleteLocalFeedItemsDbAllUsers: ->
    self = this
    all_users <- getAllUsers()
    async.eachSeries all_users, (username, callback) ->
      deleteLocalDb "feeditems_#{username}", ->
        callback(null, null)
    , ->
      self.fire 'task-left', self
  deleteLocalFinishedItemsDbAllUsers: ->
    self = this
    all_users <- getAllUsers()
    async.eachSeries all_users, (username, callback) ->
      deleteLocalDb "finisheditems_#{username}", ->
        callback(null, null)
    , ->
      self.fire 'task-left', self
  deleteLocalLogsDbAllUsers: ->
    self = this
    all_users <- getAllUsers()
    async.eachSeries all_users, (username, callback) ->
      deleteLocalDb "logs_#{username}", ->
        callback(null, null)
    , ->
      self.fire 'task-left', self
  deleteAllLocalDbAllUsers: ->
    self = this
    all_users <- getAllUsers()
    async.eachSeries all_users, (username, callback) ->
      <- deleteLocalDb "finisheditems_#{username}"
      <- deleteLocalDb "logs_#{username}"
      <- deleteLocalDb "feeditems_#{username}"
      callback(null, null)
    , ->
      self.fire 'task-left', self
  clearLogs: ->
    self = this
    username <- getUsername()
    clearDb "logs_#{username}", ->
      self.fire 'task-left', self
  hideAdminActivity: ->
    console.log 'hideAdminActivity'
    this.fire 'hide-admin-activity', this
    this.fire 'task-left', this
  controlcondition_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true

    if checked
      setParam 'hidesharebutton', true
      setParam 'hidehelpbutton', true
      setParam 'showposterthumbnail', false
      setParam 'skipsharescreen', true
      setParam 'condition1', false
      setParam 'condition2', false
      
    setParam 'controlcondition', checked
    window.location.reload()
  
  condition1_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true

    if checked
      setParam 'hidesharebutton', true
      setParam 'hidehelpbutton', true
      setParam 'showposterthumbnail', false
      setParam 'skipsharescreen', false
      setParam 'controlcondition', false
      setParam 'condition2', false

    setParam 'condition1', checked
    window.location.reload()

  condition2_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true

    if checked
      setParam 'hidesharebutton', true
      setParam 'hidehelpbutton', true
      setParam 'showposterthumbnail', true
      setParam 'skipsharescreen', false
      setParam 'condition1', false
      setParam 'controlcondition', false
    
    setParam 'condition2', checked
    window.location.reload()

  showposterthumbnail_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true
    if checked
      this.fire 'show-poster-thumbnail', this
    else
      this.fire 'hide-poster-thumbnail', this
    setParam 'showposterthumbnail', checked
    window.location.reload()
  skipsharescreen_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true
    setParam 'skipsharescreen', checked
  hidesharebutton_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true
    if checked
      this.fire 'hide-share-button', this
    else
      this.fire 'show-share-button', this
    setParam 'hidesharebutton', checked
  hidehelpbutton_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true
    if checked
      this.fire 'hide-help-button', this
    else
      this.fire 'show-help-button', this
    setParam 'hidehelpbutton', checked
  maketransparentbutton_changed: (evt) ->
    checked = false
    if evt? and evt.target? and evt.target.checked? and evt.target.checked == true
      checked = true
    if checked
      this.fire 'make-all-buttons-transparent', this
    else
      this.fire 'make-all-buttons-opaque', this
    setParam 'maketransparentbutton', checked
  suggestionformula_changed: (evt) ->
    new_suggestion_formula = 'default'
    if evt? and evt.target? and evt.target.value?
      new_suggestion_formula = evt.target.value
    setParam 'suggestionformula', new_suggestion_formula
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
      self.fire 'task-left', self
  clearFinishedItems: ->
    self = this
    username <- getUsername()
    clearDb "finisheditems_#{username}", ->
      self.fire 'task-left', self
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
      self.fire 'task-left', self
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
        self.fire 'task-left', self
      #postItem "feeditems_#{username}", {itemtype, data, social}, ->
      #  self.fire 'task-left', self
  displayLogs: ->
    getlogs (logs) ~>
      this.S('#logdisplay').text JSON.stringify(logs, null, 2)
  displayErrors: ->
    geterrors (errors) ~>
      this.S('#errordisplay').text JSON.stringify(errors, null, 2)
  displayLogAnalysis: ->
    getlogs (logs) ~>
      this.S('#loganalysisdisplay').text getLogAnalysisResultsAsString(logs)
  downloadLogs: ->
    getlogs (logs) ~>
      document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(logs, null, 2))
}
