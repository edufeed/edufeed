RegisterActivity {
  is: 'iframe-activity'
  properties: {
    activitypage: {
      type: String
      value: 'iframe-example.html'
    }
    activityurl: {
      type: String
      computed: 'compute_activityurl(activitypage, params)'
    }
    params: {
      type: Object
      value: {
        foo: 'hello'
        bar: 'world'
      }
    }
  }
  #activityurl_changed: (newurl, oldurl) ->
  #  this.$$('#contentframe').src = newurl
  compute_activityurl: (activitypage, params) ->
    separator = '?'
    if activitypage.indexOf('?') != -1
      separator = '&'
    return activitypage + separator + $.param(params)
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
