Polymer {
  is: 'admin-activity'
  S: (pattern) ->
    return $(this.$$(pattern))
  clearItems: ->
    self = this
    clearDb 'feeditems', ->
      self.fire 'task-finished', self
  addSampleItems: ->
    self = this
    wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear']
    items = [{itemtype: 'admin'}, {itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, meta: {poster: 'geza'}}] ++ [{itemtype: 'typeword', data: {word: word}, meta: {poster: 'someuser'}} for word in wordlist]
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
    meta_text = this.S('#metainput').val()
    meta = jsyaml.safeLoad meta_text
    postItem 'feeditems', {itemtype, data, meta}, ->
      self.fire 'task-finished', self
}
