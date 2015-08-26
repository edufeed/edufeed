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

export sendmessage = (messagetype, data) ->
  parent.postMessage({
    messagetype
    data
  }, '*')

export addlog = (data) ->
  sendmessage('addlog', data)

export sendSampleLogs = ->
  addlog {
    somemessage: 'barbar'
    bax: 'qux'
  }

export leaveActivity = ->
  sendmessage('task-left')

export finishActivity = ->
  sendmessage('task-finished')

$(document).ready ->
  params = getUrlParameters()
  $('#foodiv').text(params.foo)
  $('#bardiv').text(params.bar)
