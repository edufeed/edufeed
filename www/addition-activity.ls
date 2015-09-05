RegisterActivity {
  is: 'addition-activity'
  properties: {
    activitypage: {
      type: String
      value: 'addition.html'
    }
    activityurl: {
      type: String
      computed: 'compute_activityurl(activitypage, sum, add)'
    }
    sum: {
      type: Number
      value: 2
    }
    add: {
      type: Number
      value: 1
    }
  }
  compute_activityurl: (activitypage, sum, add) ->
    separator = '?'
    if activitypage.indexOf('?') != -1
      separator = '&'
    return activitypage + separator + $.param({sum, add})
  ready: ->
    self = this
    window.addEventListener 'message', (obj) ->
      if not obj? or not obj.data?
        return
      {messagetype, data} = obj.data
      if messagetype == 'addlog'
        addlog(data)
        return
      self.fire(messagetype, self)
}
