RegisterActivity {
  is: 'balance-activity'
  properties: {
    activitypage: {
      type: String
      value: 'balance.html'
    }
    activityurl: {
      type: String
      computed: 'compute_activityurl(activitypage, number)'
    }
    number: {
      type: Number
      value: 1
    }
  }
  compute_activityurl: (activitypage, number) ->
    separator = '?'
    if activitypage.indexOf('?') != -1
      separator = '&'
    return activitypage + separator + $.param({number})
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
