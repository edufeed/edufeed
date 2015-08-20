Polymer {
  is: 'share-button'
  showClassmates: ->
    username <- getUsername()
    classmates <- getClassmates(username)
    for classmate in classmates
      console.log classmate
}

