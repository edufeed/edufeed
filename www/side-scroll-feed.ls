Polymer {
  is: 'side-scroll-feed'
  properties: {
    items: {
      type: Array
      value: []
      observer: 'itemsChanged'
    }
  }
  S: (pattern) ->
    $(this.$$(pattern))
  closeActivity: ->
    this.S('#activity').html('')
    this.S('#thumbnails').show()
    this.S('#exitbutton').hide()
  itemFinished: (item) ->
    for x in $('social-thumbnail')
      tag = $(x).find('#thumbnail')
      if not tag?
        return
      tag = tag[0]
      if not tag?
        return
      if tagMatchesItem tag, item
        username <- getLocalStorage().get('username')
        username = username ? 'cat'
        if x.finishedby.indexOf(username) == -1
          x.finishedby = x.finishedby ++ [username]
          #x.finishedby.push 'cat'
  openItem: (item) ->
    this.S('#thumbnails').hide()
    this.S('#exitbutton').show()
    this.S('#activity').html('')
    activity = makeActivity(item) # feed-items.ls
    activity.on 'task-finished', ~>
      addlog {event: 'task-finished', item: item}
      this.itemFinished item
      this.closeActivity()
    activity.appendTo this.S('#activity')
  addItemToFeed: (item) ->
    thumbnail = makeSocialThumbnail item
    thumbnail.find('#thumbnail').click ~>
      addlog {event: 'task-started', item: item}
      this.openItem item
    this.S('#thumbnails').append thumbnail
  itemsChanged: (newitems, olditems) ->
    if newitems === olditems
      return
    this.S('#thumbnails').html('')
    for item in this.items
      this.addItemToFeed item
  updateItems: (firstvisit) ->
    self = this
    docs <- getItems 'feeditems'
    if not docs? or not docs.length?
      docs = []
    admin <- getBoolParam 'admin'
    if docs.length == 0 or (admin and (docs.map (.itemtype)).indexOf('admin') == -1)
      docs := [{itemtype: 'admin', social: {poster: 'horse'}}] ++ docs
    self.items = docs
    if firstvisit? and firstvisit
      addlog {event: 'visitfeed'}
  #listVisibleItems: ->
  #  
  ready: ->
    #console.log 'docs 1 are:'
    #console.log docs
    self = this
    this.updateItems(true)
    setSyncHandler 'feeditems', (change) ->
      self.updateItems()
}
