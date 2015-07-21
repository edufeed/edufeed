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
  closeFocusedItem: ->
    this.S('#focusitem').html('')
    this.S('#thumbnails').show()
    this.S('#exitbutton').hide()
  openItem: (item) ->
    self = this
    this.S('#thumbnails').hide()
    this.S('#exitbutton').show()
    this.S('#focusitem').html('')
    {itemtype} = item
    {activity} = itemtypes[itemtype]
    focus_item = $("<#{activity}>")
    for k,v of item
      focus_item.prop k, v
    $(focus_item).on 'task-finished', ->
      self.closeFocusedItem()
    focus_item.appendTo this.S('#focusitem')
  addItemToFeed: (item) ->
    self = this
    {itemtype} = item
    {thumbnail} = itemtypes[itemtype]
    new_item = $("<#{thumbnail}>")
    for k,v of item
      new_item.prop k, v
    new_item.click ->
      self.openItem item
    new_item.appendTo self.S('#thumbnails')
  itemsChanged: ->
    for item in this.items
      this.addItemToFeed item
  ready: ->
    self = this
    $.getJSON '/getfeeditems', (data) ->
      self.items = data
}
