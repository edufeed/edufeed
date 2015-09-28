Polymer {
  is: 'taskfinished-display'
  properties: {
  }
  S: (pattern) ->
    return $(this.$$(pattern))
  closeTaskFinishedDisplay: ->
    console.log 'close task finished display!'

    # share with checked classmate(s)
    classmates = this.S('#classmate_avatars').children()
    for classmate in classmates
      if classmate.checked
        name = classmate.attributes['username'].value
        this.fire 'share-activity', {username: name}
        console.log 'shared with: ' + name

    this.fire 'close-taskfinished', this
  # Tallies how many classmates the user has checked
  # to share with
  numClassmatesChecked: ->
    totalChecked = 0
    classmates = this.S('#classmate_avatars').children()
    for classmate in classmates
      if classmate.checked
        totalChecked += 1
    return totalChecked
  # Switches the checkmark to the avatar sent to the function
  # and removes all checkmarks from other avatars
  switchCheckmark: (avatar) ->
    classmates = this.S('#classmate_avatars').children()
    for classmate in classmates
      if classmate.checked
        classmate.checked = false
    avatar.prop('checked', true)
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
      synthesize_word 'share this with one friend'
    , 1000
    username <- getUsername()
    all_classmates <- getClassmates(username)
    all_classmates = [x for x in all_classmates when x != username]

    # Randomly choose 3 classmates to potentially share with
    classmates = []
    classmatesPicked = 0
    maxShareTo = 5
    if all_classmates.length <= maxShareTo
      maxShareTo = all_classmates.length

    while classmatesPicked < maxShareTo
      i = Math.floor(Math.random() * all_classmates.length)
      if all_classmates[i] not in classmates
        classmates.push(all_classmates[i])
        classmatesPicked += 1
    
    maxSharedWith = 1
    for let classmate in classmates
      avatar = $("<user-avatar username='#{classmate}' size='m'>").css({'cursor': 'pointer', 'display': 'inline-block'})
      avatar.click ->
        #synthesize_multiple_words ['shared with', classmate]

        # Only check the last one tapped
        if not avatar.prop('checked')
          self.switchCheckmark(avatar)
        else
          avatar.prop('checked', false)

        /* # Only toggle on and off checking
        if avatar.prop('checked')
          avatar.prop('checked', false)
        else
          sharedWith = self.numClassmatesChecked()
          if sharedWith < maxSharedWith
            avatar.prop('checked', true)*/
        #self.fire 'share-activity', {username: classmate}
          
      avatar.appendTo self.S('#classmate_avatars')
    #username <- getUsername()
    #console.log 'your username is:'
    #console.log username
}