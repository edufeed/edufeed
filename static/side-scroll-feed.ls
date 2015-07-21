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
  openItem: (item) ->
    this.S('#thumbnails').hide()
    this.S('#exitbutton').show()
    this.S('#activity').html('')
    activity = makeActivity(item) # feed-items.ls
    activity.on 'task-finished', ~>
      this.closeActivity()
    activity.appendTo this.S('#activity')
  addItemToFeed: (item) ->
    thumbnail = makeThumbnail(item) # feed-items.ls
    thumbnail.click ~>
      this.openItem item
    thumbnail.appendTo this.S('#thumbnails')
  itemsChanged: ->
    for item in this.items
      this.addItemToFeed item
  ready: ->
    self = this
    $.getJSON '/getfeeditems', (data) ->
      self.items = data
}
