Polymer {
  is: 'user-avatar'
  properties: {
    username: {
      type: String
      value: ''
      observer: 'usernameChanged'
    }
    checked: {
      type: Boolean
      value: false
      observer: 'checkedChanged'
    }
    size: {
      type: String
      value: 'r'
      observer: 'sizeChanged'
    }
  }
  sizeChanged: ->
    if this.size == 's'
      this.$$('#profilepic').width = 50
      this.$$('#profilepic').height = 50
    else if this.size == 'r'
      this.$$('#profilepic').width = 100
      this.$$('#profilepic').height = 100
    else if this.size == 'l'
      this.$$('#profilepic').width = 350
      this.$$('#profilepic').height = 350
    else if this.size == 'm'
      this.$$('#profilepic').width = 150
      this.$$('#profilepic').height = 150
  usernameChanged: (newname, oldname) ->
    if newname == oldname
      return
    #if not newname? or newname.length == 0
    #  newname = 'cat'
    profilepic_paths <~ get_profilepic_paths()
    if newname != this.username # username changed
      return
    if profilepic_paths[newname]?
      this.$$('#profilepic').imgsrc = profilepic_paths[newname]
    else
      this.$$('#profilepic').query = newname
  checkedChanged: ->
    if this.checked
      $(this.$$('#checkmark')).show()
    else
      $(this.$$('#checkmark')).hide()
}
