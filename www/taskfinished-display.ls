RegisterActivity {
  is: 'taskfinished-display'
  properties: {
  }
  S: (pattern) ->
    return $(this.$$(pattern))
  closeTaskFinishedDisplay: ->
    console.log 'close task finished display!'
    this.fire 'close-taskfinished', this
  ready: ->
    self = this
    skipsharescreen <- getBoolParam('skipsharescreen')
    if skipsharescreen
      self.style.opacity = 0.0
      setTimeout ->
        self.fire 'close-taskfinished', this
      , 0
      return
    else
      self.style.opacity = 1.0
    setTimeout ->
      #play_success_sound ->
      self.$$('#sharemessage').playSentence()
    , 1000
    username <- getUsername()
    classmates <- getClassmates(username)
    classmates = [x for x in classmates when x != username]
    for let classmate in classmates
      avatar = $("<user-avatar username='#{classmate}'>").css({'cursor': 'pointer', 'display': 'inline-block'})
      avatar.click ->
        synthesize_multiple_words ['shared with', classmate]
        avatar.prop('checked', true)
        self.fire 'share-activity', {username: classmate}
      avatar.appendTo self.S('#classmate_avatars')
    #username <- getUsername()
    #console.log 'your username is:'
    #console.log username
}