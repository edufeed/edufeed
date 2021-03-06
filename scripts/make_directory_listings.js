(function(){
  var fs, yamlfile, directory_listing_paths, ref$, exit_if_error, exit_with_error, log_success, make_directory_listing, main;
  fs = require('fs');
  yamlfile = require('yamlfile');
  directory_listing_paths = {
    'images': 'image_paths.yaml',
    'profilepics': 'profilepic_paths.yaml',
    'speechsynth_en': 'speechsynth_en_paths.yaml'
  };
  ref$ = require('logutils'), exit_if_error = ref$.exit_if_error, exit_with_error = ref$.exit_with_error, log_success = ref$.log_success;
  make_directory_listing = function(directory, outfile){
    var directory_path, file_list, output, i$, len$, filename, basename;
    directory_path = "www/" + directory;
    if (!fs.existsSync(directory_path)) {
      exit_with_error("directory " + directory_path + " does not exist, please run this script from the root of the edufeed directory");
    }
    file_list = fs.readdirSync(directory_path).sort();
    output = {};
    for (i$ = 0, len$ = file_list.length; i$ < len$; ++i$) {
      filename = file_list[i$];
      basename = filename.split('.')[0];
      if (basename.length === 0) {
        continue;
      }
      output[basename] = directory + "/" + filename;
    }
    yamlfile.writeFileSync(outfile, output);
    return log_success({
      message: directory,
      directory_path: directory_path,
      outfile: outfile
    });
  };
  main = function(){
    var directory, ref$, outfile, results$ = [];
    for (directory in ref$ = directory_listing_paths) {
      outfile = ref$[directory];
      results$.push(make_directory_listing(directory, "www/" + outfile));
    }
    return results$;
  };
  main();
}).call(this);
