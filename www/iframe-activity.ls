RegisterActivity {
  is: 'iframe-activity'
  properties: {
    framepage: {
      type: String
      value: 'iframe-example.html'
    }
    srcurl: {
      type: String
      computed: 'compute_srcurl(framepage, foo, bar)'
    }
    foo: {
      type: String
      value: 'hello'
    }
    bar: {
      type: String
      value: 'world'
    }
  }
  compute_srcurl: (framepage, foo, bar) ->
    return framepage + '?' + $.param {
      foo
      bar
    }
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
