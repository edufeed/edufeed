(function(){
  var fs, getsecret, request, async, ref$, exit_if_error, exit_with_error, log_success, bing_api_key, Bing, download_image, main, slice$ = [].slice;
  fs = require('fs');
  getsecret = require('getsecret');
  request = require('request');
  async = require('async');
  ref$ = require('logutils'), exit_if_error = ref$.exit_if_error, exit_with_error = ref$.exit_with_error, log_success = ref$.log_success;
  bing_api_key = getsecret('bing_api_key');
  Bing = require('node-bing-api')({
    accKey: bing_api_key
  });
  download_image = function(query, callback){
    return Bing.images(query, {}, function(err, res, body){
      var url;
      exit_if_error(err);
      if (body == null || body.d == null || body.d.results == null) {
        exit_with_error('no results found');
      }
      url = body.d.results[0].MediaUrl;
      return request({
        url: url,
        encoding: null
      }, function(err2, res2, data){
        var content_type, content_type_to_extension, extension, outfile;
        exit_if_error(err2);
        content_type = res2.headers['content-type'];
        content_type_to_extension = {
          'image/jpeg': 'jpg',
          'image/png': 'png'
        };
        extension = content_type_to_extension[content_type];
        if (extension == null) {
          exit_with_error({
            message: 'unexpected content type',
            'content-type': content_type,
            'url': url
          });
        }
        outfile = "www/images/" + query + "." + extension;
        fs.writeFileSync(outfile, data);
        log_success(outfile);
        return callback(null, outfile);
      });
    });
  };
  main = function(){
    var queries;
    queries = slice$.call(process.argv, 2);
    if (queries.length === 0) {
      exit_with_error('please provide a search term as the argument');
    }
    if (!fs.existsSync('www/images')) {
      exit_with_error('directory www/images does not exist, please run this script from the root of the edufeed directory');
    }
    return async.map(queries, download_image, function(err, results){
      return process.exit();
    });
  };
  main();
}).call(this);
