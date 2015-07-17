Polymer {
  is: 'side-scroll-feed'
  S: (pattern) ->
    $(this.$$(pattern))
  closeTask: ->
    this.S('#focusitem').html('')
    this.S('#thumbnails').show()
    this.S('#exitbutton').hide()
  addThumbnail: (word) ->
    self = this
    new_item = $("<word-thumbnail word='#{word}'>")
    new_item.click ->
      self.S('#thumbnails').hide()
      self.S('#exitbutton').show()
      self.S('#focusitem').html('')
      focus_item = $("<practice-word word='#{word}'>")
      $(focus_item).on 'task-finished', ->
        self.closeTask()
      focus_item.appendTo self.S('#focusitem')
    new_item.appendTo self.S('#thumbnails')
  ready: ->
    for word in ['cat', 'dog', 'white', 'black', 'bee']
      this.addThumbnail word
}
