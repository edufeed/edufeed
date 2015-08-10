console.log 'index.js loaded!'

startPage = ->
  console.log 'startPage called!'
  params = getUrlParameters()
  tagname = params.tag
  if params.activity?
    tagname = params.activity + '-activity'
  if params.thumbnail?
    tagname = params.thumbnail + '-thumbnail'
  if not tagname?
    tagname = 'side-scroll-feed'
  tag = $("<#{tagname}>")
  for k,v of params
    if k == 'tag'
      continue
    tag.prop k, v
  tag.appendTo '#contents'
  /*
  $('head').append($('<link>').prop('rel', 'import').prop('href', 'social-thumbnail.html'))
  setTimeout ->
    params = getUrlParameters()
    tagname = params.tag
    console.log 'tagname is:'
    console.log tagname
    if params.activity?
      tagname = params.activity + '-activity'
    if params.thumbnail?
      tagname = params.thumbnail + '-thumbnail'
    if not tagname?
      tagname = 'side-scroll-feed'
    tag = $("<#{tagname}>")
    for k,v of params
      if k == 'tag'
        continue
      tag.prop k, v
    tag.appendTo $('body')
  , 1000
  */

if isChromeApp()
  $(document).ready ->
    startPage()
else
  window.addEventListener 'WebComponentsReady', (e) ->
    startPage()
/*
window.addEventListener 'WebComponentsReady', (e) ->
  navigator.webkitPersistentStorage.requestQuota(
    1024*1024*100,
    (grantedBytes) ->
      window.webkitRequestFileSystem(
        PERSISTENT,
        grantedBytes,
        (filesystem) ->
          setFileSystem(filesystem)
          startPage()
        ,
        (err2) ->
          console.log 'error while requesting filesystem'
          console.log err2
      )
    ,
    (err1) ->
      console.log 'error while requesting quota'
      console.log err1
  )
*/
