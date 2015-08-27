RegisterThumbnail {
  is: 'iframe-thumbnail'
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
  compute_activityurl: (activitypage, params) ->
    separator = '?'
    if activitypage.indexOf('?') != -1
      separator = '&'
    return activitypage + separator + $.param(params)
  printParams: (params) ->
    return JSON.stringify(params, null, 2)
}
