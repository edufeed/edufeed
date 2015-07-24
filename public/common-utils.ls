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

export getParam = (key) ->
  val = getUrlParameters()[key]
  if val?
    return val
  val = localStorage.getItem(key)
  if val?
    return val

export getBoolParam = (key) ->
  val = getParam(key)
  if val? and (val == true or (val[0]? and ['t', 'T', 'y', 'Y'].indexOf(val[0]) != -1))
    return true
  return false

export setParam = (key, val) ->
  localStorage.setItem key, val
  new_params = getUrlParameters()
  new_params[key] = val
  window.history.pushState(null, null, window.location.pathname + '?' + $.param(new_params))
