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
  }
  usernameChanged: (newname, oldname) ->
    if newname == oldname
      return
    #if not newname? or newname.length == 0
    #  newname = 'cat'
    this.$$('#profilepic').query = newname
  checkedChanged: ->
    if this.checked
      $(this.$$('#checkmark')).show()
    else
      $(this.$$('#checkmark')).hide()
}
