RegisterActivity {
  is: 'subtraction-activity'
  properties: {
    activitypage: {
      type: String
      value: 'subtraction.html'
    }
    activityurl: {
      type: String
      computed: 'compute_activityurl(activitypage, diff, sub)'
    }
    diff: {
      type: Number
      value: 2
    }
    sub: {
      type: Number
      value: 1
    }
  }
  compute_activityurl: (activitypage, diff, sub) ->
    separator = '?'
    if activitypage.indexOf('?') != -1
      separator = '&'
    return activitypage + separator + $.param({diff, sub})
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
