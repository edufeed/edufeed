# creates the yaml files for directory listings

require! {
  fs
  yamlfile
}

directory_listing_paths = {
  'images': 'image_paths.yaml'
  'profilepics': 'profilepic_paths.yaml'
  'speechsynth_en': 'speechsynth_en_paths.yaml'
}

{exit_if_error, exit_with_error, log_success} = require 'logutils'

make_directory_listing = (directory, outfile) ->
  directory_path = "www/#{directory}"
  if not fs.existsSync(directory_path)
    exit_with_error "directory #{directory_path} does not exist, please run this script from the root of the edufeed directory"
  file_list = fs.readdirSync(directory_path).sort()
  output = {}
  for filename in file_list
    basename = filename.split('.')[0]
    if basename.length == 0
      continue
    output[basename] = "#{directory}/#{filename}"
  yamlfile.writeFileSync outfile, output
  log_success {message: directory, directory_path, outfile}

main = ->
  for directory,outfile of directory_listing_paths
    make_directory_listing directory, "www/#{outfile}"

main()
