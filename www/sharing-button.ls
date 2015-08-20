Polymer {
  is: 'sharing-button'
  closeShareWidget: ->
    $(this).find('#share_avatars').html('')
  sharebuttonClicked: ->
    self = this
    if $(self).find('#share_avatars').html().trim() != ''
      self.closeShareWidget()
      return
    username <- getUsername()
    classmates <- getClassmates(username)
    classmates = [x for x in classmates when x != username]
    for let classmate,idx in classmates
      if idx % 3 == 0
        $(self).find('#share_avatars').append $('<div>')
      avatar = $("<user-avatar username='#{classmate}'>")
      avatar.click ->
        avatar.prop('checked', true)
        self.fire 'share-activity', {username: classmate}
      $(self).find('#share_avatars').append avatar
}

