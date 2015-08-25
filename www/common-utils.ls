export isChromeApp = ->
  return chrome? and chrome.app? and chrome.app.runtime?

export isMobileChromeApp = ->
  return chrome? and chrome.app? and chrome.app.runtime? and chrome.mobile?

export getLocalStorage = ->
  if isChromeApp() and not isMobileChromeApp()
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
  if window.localStorage?
    return {
      get: (key, callback) ->
        callback window.localStorage.getItem(key)
      set: (key, val, callback) ->
        window.localStorage.setItem(key, val)
        if callback?
          callback(val)
    }

export getUsername = (callback) ->
  getLocalStorage().get 'username', (username) ->
    callback(username ? 'guestuser')

export getPassword = (callback) ->
  getLocalStorage().get 'password', (password) ->
    callback(password ? 'guestuser')

export getCouchURL = (callback) ->
  default_couch_server = '127.0.0.1:5984'
  getLocalStorage().get 'couchserver', (couchserver) ->
    if couchserver? and couchserver.length > 0
      callback couchserver
      return
    else
      $.get('/getcouchserver').done((data) ->
        if data? and data.length > 0
          setCouchURL data, ->
            callback data
        else
          callback default_couch_server
      ).fail( ->
        callback default_couch_server
      )

export setUsername = (username, callback) ->
  getLocalStorage().set 'username', username, callback

export setPassword = (password, callback) ->
  getLocalStorage().set 'password', password, callback

export setCouchURL = (couchserver, callback) ->
  if couchserver.indexOf('cloudant.com') == -1
    if couchserver.indexOf(':') == -1
      couchserver = couchserver + ':5984'
  getLocalStorage().set 'couchserver', couchserver, callback

export memoizeSingleAsync = (func) ->
  cached_val = null
  return (callback) ->
    if cached_val?
      callback(cached_val)
      return
    func (result) ->
      cached_val := result
      callback result

export getClasses = memoizeSingleAsync (callback) ->
  $.get '/classes.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    callback data

export getAllUsers = (callback) ->
  classes <- getClasses()
  all_users = []
  for classname,classinfo of classes
    all_users = all_users.concat classinfo.users
  callback all_users

export getClassmates = (username, callback) ->
  classes <- getClasses()
  for classname,classinfo of classes
    {users} = classinfo
    if users.indexOf(username) != -1
      callback users
      return
  callback []

# error logging

errorlog = []
export adderror = (postdata) ->
  console.log postdata
  errorlog.push postdata

export geterrors = (callback) ->
  callback [x for x in errorlog]

export itemtype_and_data_matches = (item1, item2) ->
  # returns true if all keys and values in item1 are present in item2
  if item1.itemtype != item2.itemtype
    return false
  if item1.data === item2.data
    return true
  return false

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
