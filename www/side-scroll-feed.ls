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
  closeShareWidget: ->
    this.$$('#sharingbutton').closeShareWidget()
  closeActivity: ->
    this.S('#activity').html('')
    this.S('#thumbnails').show()
    this.S('#activitybuttons').hide()
    this.$$('#sharingbutton').closeShareWidget()
  itemFinished: (item) ->
    for x in $('social-thumbnail')
      tag = $(x).find('#thumbnail')
      if not tag?
        return
      tag = tag[0]
      if not tag?
        return
      if tagMatchesItem tag, item
        username <- getUsername()
        if x.finishedby.indexOf(username) == -1
          x.finishedby = x.finishedby ++ [username]
  openItem: (item) ->
    this.S('#thumbnails').hide()
    this.S('#activitybuttons').show()
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
    username <- getUsername()
    docs <- getItems "feeditems_#{username}"
    if not docs? or not docs.length?
      docs = []
    #admin <- getBoolParam 'admin'
    noadmin <- getBoolParam 'noadmin'
    if self.hide_admin_console? and self.hide_admin_console
      noadmin = true
    if docs.length == 0 or (!noadmin and (docs.map (.itemtype)).indexOf('admin') == -1)
      docs := [{itemtype: 'admin', social: {poster: 'horse'}}] ++ docs
    self.items = docs
    if firstvisit? and firstvisit
      addlog {event: 'visitfeed'}
  shareActivity: (obj, evt) ->
    self = this
    {username} = evt
    local_username <- getUsername()
    console.log 'sharing with: ' + username
    if not username?
      console.log 'no username'
      return
    console.log 'current activity info is: '
    {itemtype, data, social} = self.S('#activity').children()[0].getalldata()
    if not itemtype?
      console.log 'do not have itemtype'
      return
    postItemToTarget username, {
      itemtype: itemtype
      data: data
      social: {
        poster: local_username
      }
    }
  ready: ->
    self = this
    $(this).on 'hide-admin-activity', ->
      self.hide_admin_console = true
      self.updateItems()
    this.updateItems(true)
    getUsername (username) ->
      setSyncHandler "feeditems_#{username}", (change) ->
        self.updateItems()
}
