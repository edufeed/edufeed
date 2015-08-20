export get_image_paths = memoizeSingleAsync (callback) ->
  $.get '/image_paths.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    callback data

export get_profilepic_paths = memoizeSingleAsync (callback) ->
  $.get '/profilepic_paths.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    callback data

export get_speechsynth_paths = memoizeSingleAsync (callback) ->
  $.get '/speechsynth_en_paths.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    callback data
