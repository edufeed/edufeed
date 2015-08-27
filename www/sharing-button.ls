Polymer {
  is: 'sharing-button'
  isShareWidgetOpen: ->
    if $(this).find('#share_avatars').html().trim() != ''
      return true
    return false
  closeShareWidget: ->
    $(this).find('#share_avatars').html('')
  sharebuttonClicked: ->
    self = this
    if self.isShareWidgetOpen()
      self.closeShareWidget()
      return
    synthesize_word 'who would you like to share this with'
    username <- getUsername()
    classmates <- getClassmates(username)
    classmates = [x for x in classmates when x != username]
    for let classmate in classmates
      avatar = $("<user-avatar username='#{classmate}'>").css({float: 'right'})
      avatar.click ->
        synthesize_multiple_words ['shared with', classmate]
        avatar.prop('checked', true)
        self.fire 'share-activity', {username: classmate}
      $(self).find('#share_avatars').append avatar
}

