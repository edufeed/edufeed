export isChromeApp = ->
  return chrome? and chrome.app? and chrome.app.runtime?

export getLocalStorage = ->
  if chrome? and chrome.storage? and chrome.storage.local?
    return {
      get: (key, callback) ->
        chrome.storage.local.get key, (dict) ->
          callback dict[key]
      set: (key, val, callback) ->
        dict = {}
        dict[key] = val
        if callback?
          chrome.storage.local.set dict, -> callback(val)
        else
          chrome.storage.local.set dict
    }
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

# filesystem related

/*
localinfo = {}
export setFileSystem = (filesystem, callback) ->
  localinfo.filesystem = filesystem

export getFileSystem = ->
  return localinfo.filesystem

export getDir = (dirname, callback) ->
  filesystem = getFileSystem()
  filesystem.root.getDirectory(
    dirname,
    {create: true},
    (direntry) ->
      callback direntry
    ,
    (err) ->
      console.log 'error getting directory ' + dirname
      console.log err
  )

export getImageFile = (filename, callback) ->
  getDir 'images', (imgdir) ->
    imgdir.getFile(
      filename,
      {create: true},
      (imgfile) ->
        callback imgfile
      ,
      (err) ->
        console.log 'error getting file ' + filename
        console.log err
    )

export writeImageMimetype = (imgname, mimetype, callback) ->
  getImageFileWriter imgname + '.txt', (filewriter) ->
    filewriter.onwriteend = (e) ->
      if callback?
        callback()
    filewriter.write new Blob([mimetype], {type: 'text/plain'})

export writeImageData = (imgname, base64data, callback) ->
  getImageFileWriter imgname + '.jpg', (filewriter) ->
    filewriter.onwriteend = (e) ->
      if callback?
        callback()
    filewriter.write base64toblob(base64data, {type: ''})

export writeImageToFile = (imgname, base64string, callback) ->
  mimetype = base64string.slice(base64string.indexOf(':') + 1, base64string.indexOf(';'))
  base64data = base64string.slice(base64string.indexOf(',') + 1)
  writeImageMimetype imgname, mimetype, ->
    writeImageData imgname, base64data, ->
      if callback?
        callback()

export getImageFileReader = (filename, callback) ->
  getImageFile filename, (imgfile) ->
    callback new FileReader(imgfile.file)

export getImageFileWriter = (filename, callback) ->
  getImageFile filename, (imgfile) ->
    imgfile.createWriter (filewriter) ->
      callback filewriter
*/

# url parameters related

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

export getParam = (key, callback) ->
  value = getUrlParameters()[key]
  if value?
    callback value
    return
  val <- getLocalStorage().get key
  callback val

export getBoolParam = (key, callback) ->
  val <- getParam key
  if val? and (val == true or (val.length? and val[0]? and ['t', 'T', 'y', 'Y'].indexOf(val[0]) != -1))
    callback true
    return
  callback false

export setParam = (key, val) ->
  getLocalStorage().set key, val
  new_params = getUrlParameters()
  new_params[key] = val
  window.history.pushState(null, null, window.location.pathname + '?' + $.param(new_params))

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