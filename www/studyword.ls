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

window.addEventListener 'WebComponentsReady', (e) ->
  params = getUrlParameters()
  word = params.word ? 'dog'
  $('practice-word').prop 'word', word
  # imports are loaded and elements have been registered
  # console.log('Components are ready');
  # $('#foo').append($('<my-counter >'))
  # $('#foo').append($('<my-counter>'))
  # $('#foo').append($('<name-tag>'))
  # $('#foo').append($('<editable-name-tag>'))
  #$('latin-keyboard').
