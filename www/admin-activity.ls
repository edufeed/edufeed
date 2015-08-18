RegisterActivity {
  is: 'admin-activity'
  S: (pattern) ->
    return $(this.$$(pattern))
  ready: ->
    self = this
    getUsername (username) ->
      getPassword (password) ->
        getCouchURL (couchserver) ->
          self.S('#usernameinput').val(username)
          self.S('#passwordinput').val(password)
          self.S('#couchserverinput').val(couchserver)
          self.S('#itemtypeinput').val 'typeword'
          self.S('#datainput').val jsyaml.safeDump({word: 'cat'}).trim()
          self.S('#socialinput').val jsyaml.safeDump({poster: username}).trim()
          self.S('#targetinput').val username.trim()
  appcacheStatus: ->
    return <[ uncached idle checking downloading updateready ]>[window.applicationCache.status]
  reallySetUsername: (username, password, couchserver) ->
    setUsername username, ->
      setPassword password, ->
        setCouchURL couchserver, ->
          window.location.reload()
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
  addSampleItems: ->
    self = this
    username <- getUsername()
    wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear']
    items = (
      [
        {itemtype: 'admin', social: {poster: 'horse'}}
        {itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}
      ] ++
      [{itemtype: 'bars', data: {level: levelnum}, social: {poster: 'dog'}} for levelnum in [0 to 2]] ++
      [{itemtype: 'dots', data: data, social: {poster: 'mouse'}} for data in [{numdots: 7, targetformula: '_x_=_'}, {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]] ++
      [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist] ++
      [{itemtype: 'typeword', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]
    )
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
  downloadLogs: ->
    getlogs (logs) ~>
      document.location = 'data:Application/octet-stream,' + encodeURIComponent(JSON.stringify(logs, null, 2))
}
