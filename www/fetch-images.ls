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
