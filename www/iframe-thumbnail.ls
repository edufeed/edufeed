RegisterThumbnail {
  is: 'iframe-thumbnail'
  properties: {
    activitypage: {
      type: String
      value: 'iframe-activity-example.html'
    }
    activityurl: {
      type: String
      computed: 'compute_activityurl(activitypage, params)'
    }
    thumbnailpage: {
      type: String
      value: 'iframe-thumbnail-example.html'
    }
    thumbnailurl: {
      type: String
      computed: 'compute_thumbnailurl(thumbnailpage, params)'
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
  compute_thumbnailurl: (thumbnailpage, params) ->
    separator = '?'
    if thumbnailpage.indexOf('?') != -1
      separator = '&'
    nparams = {
      activitypage: this.activitypage
      activityurl: this.activityurl
      isthumbnail: true
    } <<< params
    return thumbnailpage + separator + $.param(nparams)
}
