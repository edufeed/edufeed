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

export getLocalStorage = ->
  if chrome? and chrome.storage? and chrome.storage.local?
    return chrome.storage.local
  if window.localStorage?
    return {
      get: (key, callback) ->
        callback window.localStorage.getItem(key)
      set: (key, val, callback) ->
        window.localStorage.setItem(key, val)
        if callback?
          callback(val)
    }

/*
export getParam = (key) ->
  val = getUrlParameters()[key]
  if val?
    return val
  val = getLocalStorage().getItem(key)
  if val?
    return val

export getBoolParam = (key) ->
  val = getParam(key)
  if val? and (val == true or (val[0]? and ['t', 'T', 'y', 'Y'].indexOf(val[0]) != -1))
    return true
  return false

export setParam = (key, val) ->
  getLocalStorage().setItem key, val
  new_params = getUrlParameters()
  new_params[key] = val
  window.history.pushState(null, null, window.location.pathname + '?' + $.param(new_params))
*/

export parseInlineCSS = (text) ->
  output = {}
  for line in text.split(';')
    if not line?
      continue
    line = line.trim()
    if line.length == 0
      continue
    [key, value] = line.split(':')
    if not key? or not value?
      continue
    key = key.trim()
    value = value.trim()
    if key.length == 0 or value.length == 0
      continue
    output[key] = value
  return output

export applyStyleTo = (tag, style) ->
  for k,v of parseInlineCSS(style)
    tag.style[k] = v

export setPropDict = (tag, data) ->
  if data?
    if tag.prop? and (typeof(tag.prop) == 'function') # is jquery
      for k,v of data
        tag.prop k, v
    else # regular element
      for k,v of data
        tag[k] = v

export tagMatchesItem = (tag, item) ->
  {itemtype, data} = item
  tag_type = tag.tagName.toLowerCase().split('-thumbnail').join('').split('-activity').join('')
  if itemtype != tag_type
    return false
  if data?
    for k,v of data
      if tag[k] != v
        return false
  return true
