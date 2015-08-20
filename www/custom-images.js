(function(){
  var get_image_paths, get_profilepic_paths, get_speechsynth_paths, out$ = typeof exports != 'undefined' && exports || this;
  out$.get_image_paths = get_image_paths = memoizeSingleAsync(function(callback){
    return $.get('/image_paths.yaml', function(yamltxt){
      var data;
      data = jsyaml.safeLoad(yamltxt);
      return callback(data);
    });
  });
  out$.get_profilepic_paths = get_profilepic_paths = memoizeSingleAsync(function(callback){
    return $.get('/profilepic_paths.yaml', function(yamltxt){
      var data;
      data = jsyaml.safeLoad(yamltxt);
      return callback(data);
    });
  });
  out$.get_speechsynth_paths = get_speechsynth_paths = memoizeSingleAsync(function(callback){
    return $.get('/speechsynth_en_paths.yaml', function(yamltxt){
      var data;
      data = jsyaml.safeLoad(yamltxt);
      return callback(data);
    });
  });
}).call(this);
