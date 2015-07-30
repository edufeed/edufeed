export get_imagedata_by_name = (name, callback) ->
  keyname = 'cache:get_imagedata_by_name|' + escape(name)
  getLocalStorage().get keyname, (cached) ->
    if cached?
      callback cached
      return
    $.get '/imagedatabyname?' + $.param({name: name}), (imgdata) ->
      getLocalStorage().set keyname, imgdata
      callback imgdata
