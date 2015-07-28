Polymer {
  is: 'admin-activity'
  S: (pattern) ->
    return $(this.$$(pattern))
  ready: ->
    username = localStorage.getItem('username') ? 'cat'
    this.S('#usernameinput').val(username)
  setUsername: ->
    localStorage.setItem 'username', this.S('#usernameinput').val().trim()
  makeFullScreen: ->
    ssfeed = $('side-scroll-feed')[0]
    rfs = document.body.mozRequestFullScreen || document.body.webkitRequestFullScreen || document.body.requestFullScreen
    if rfs
      rfs.call(ssfeed)
  clearItems: ->
    self = this
    clearDb 'feeditems', ->
      self.fire 'task-finished', self
  addSampleItems: ->
    self = this
    wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear']
    items = [{itemtype: 'admin', social: {poster: 'horse'}}, {itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}] ++ [{itemtype: 'typeword', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]
    async.each items, (item, callback) ->
      postItem 'feeditems', item, callback
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
    postItem 'feeditems', {itemtype, data, social}, ->
      self.fire 'task-finished', self
}
