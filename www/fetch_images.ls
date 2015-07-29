export get_imagedata_by_name = (name, callback) ->
  keyname = 'cache:get_imagedata_by_name|' + escape(name)
  cached = localStorage.getItem(keyname)
  if cached?
    callback cached
    return
  $.get '/imagedatabyname?' + $.param({name: name}), (imgdata) ->
    localStorage.setItem keyname, imgdata
    callback imgdata
