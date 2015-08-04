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