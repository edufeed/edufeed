(function(){
  var cache_func_localstorage, get_imagedata_by_name_real, get_imagedata_by_name, out$ = typeof exports != 'undefined' && exports || this;
  out$.cache_func_localstorage = cache_func_localstorage = function(func, cachename){
    return function(name, callback){
      var keyname;
      keyname = 'cache:' + cachename + '|' + escape(name);
      return getLocalStorage().get(keyname, function(cached){
        if (cached != null) {
          callback(cached);
          return;
        }
        return func(name, function(data){
          getLocalStorage().set(keyname, data);
          return callback(data);
        });
      });
    };
  };
  get_imagedata_by_name_real = function(name, callback){
    var urlbase;
    urlbase = '/imagedatabyname?';
    if (isChromeApp()) {
      urlbase = 'http://edfeed.herokuapp.com/imagedatabyname?';
    }
    return $.get(urlbase + $.param({
      name: name
    }), function(imgdata){
      return callback(imgdata);
    });
  };
  if (false) {
    out$.get_imagedata_by_name = get_imagedata_by_name = cache_func_localstorage(get_imagedata_by_name_real, 'get_imagedata_by_name');
  } else {
    out$.get_imagedata_by_name = get_imagedata_by_name = get_imagedata_by_name_real;
  }
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
}).call(this);
