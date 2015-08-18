custom_images = {}
export get_image_paths = (callback) ->
  if custom_images.image_paths?
    callback custom_images.image_paths
    return
  $.get '/image_paths.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    custom_images.image_paths = data
    callback data

export get_profilepic_paths = (callback) ->
  if custom_images.profilepic_paths?
    callback custom_images.profilepic_paths
    return
  $.get '/profilepic_paths.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    custom_images.profilepic_paths = data
    callback data

export get_speechsynth_paths = (callback) ->
  if custom_images.speechsynth_paths?
    callback custom_images.speechsynth_paths
    return
  $.get '/speechsynth_en_paths.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    custom_images.speechsynth_paths = data
    callback data

export getClasses = (callback) ->
  if custom_images.classes?
    callback custom_images.classes
    return
  $.get '/classes.yaml', (yamltxt) ->
    data = jsyaml.safeLoad(yamltxt)
    custom_images.classes = data
    callback data
