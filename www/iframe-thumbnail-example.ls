export getUrlParameters = ->
  url = window.location.href
  hash = url.lastIndexOf('#')
  if hash != -1
    url = url.slice(0, hash)
  map = {}
  parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) ->
    #map[key] = decodeURI(value).split('+').join(' ').split('%2C').join(',') # for whatever reason this seems necessary?
    map[key] = decodeURIComponent(value).split('+').join(' ') # for whatever reason this seems necessary?
  )
  return map

$(document).ready ->
  params = getUrlParameters()
  $('#activitypage').text(params.activitypage)
  $('#activityurl').text(params.activityurl).prop('href', params.activityurl)
  $('#paramsdisplay').text(JSON.stringify(params.params, null, 2))
