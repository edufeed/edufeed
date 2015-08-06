RegisterActivity {
  is: 'admin-activity'
  S: (pattern) ->
    return $(this.$$(pattern))
  ready: ->
    self = this
    getUsername (username) ->
      getPassword (password) ->
        self.S('#usernameinput').val(username)
        self.S('#passwordinput').val(password)
  appcacheStatus: ->
    return <[ uncached idle checking downloading updateready ]>[window.applicationCache.status]
  reallySetUsername: (username, password) ->
    setUsername username, ->
      setPassword password, ->
        window.location.reload()
  setUsername: ->
    self = this
    username = this.S('#usernameinput').val().trim()
    password = this.S('#passwordinput').val().trim()
    test_if_can_login username, password, (login_successful) ->
      if not login_successful
        bootbox.confirm "Login was unsuccessful, are you sure you would like to update the stored username and password?", (certain) ->
          if certain
            self.reallySetUsername(username, password)
          else
            getUsername (nusername) ->
              getPassword (npassword) ->
                self.S('#usernameinput').val(nusername)
                self.S('#passwordinput').val(npassword)
      else
        self.reallySetUsername(username, password)
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
    items = [{itemtype: 'admin', social: {poster: 'horse'}}, {itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}] ++ [{itemtype: 'typeword', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]
    async.each items, (item, callback) ->
      postItem "feeditems_#{username}", item, callback
    , (results) ->
      self.fire 'task-finished', self
  addCustomItem: ->
    self = this
    itemtype = this.S('#itemtypeinput').val()
    if not itemtype? or itemtype.length == 0
      alert 'must specify itemtype'
      return
    data_text = this.S('#datainput').val()
    data = jsyaml.safeLoad data_text
    social_text = this.S('#socialinput').val()
    social = jsyaml.safeLoad social_text
    postItem "feeditems_#{username}", {itemtype, data, social}, ->
      self.fire 'task-finished', self
}
