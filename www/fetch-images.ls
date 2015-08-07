export cache_func_localstorage = (func, cachename) ->
  return (name, callback) ->
    keyname = 'cache:' + cachename + '|' + escape(name)
    cached <- getLocalStorage().get keyname
    if cached?
      callback cached
      return
    data <- func(name)
    getLocalStorage().set keyname, data
    callback data

get_imagedata_by_name_real = (name, callback) ->
  urlbase = '/imagedatabyname?'
  if isChromeApp()
    urlbase = 'http://edfeed.herokuapp.com/imagedatabyname?'
  imgdata <- $.get urlbase + $.param({name: name})
  callback imgdata

#if isChromeApp() and not isMobileChromeApp()
if false
  export get_imagedata_by_name = cache_func_localstorage get_imagedata_by_name_real, 'get_imagedata_by_name'
else
  export get_imagedata_by_name = get_imagedata_by_name_real

/*
export get_imagedata_by_name = (name, callback) ->
  keyname = 'cache:get_imagedata_by_name|' + escape(name)
  cached <- getLocalStorage().get keyname
  if cached?
    callback cached
    return
  urlbase = '/imagedatabyname?'
  if chrome? and chrome.app? and chrome.app.runtime?
    urlbase = 'http://edfeed.herokuapp.com/imagedatabyname?'
  imgdata <- $.get urlbase + $.param({name: name})
  getLocalStorage().set keyname, imgdata
  callback imgdata
*/
