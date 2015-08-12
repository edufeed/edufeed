(function(){
  var fs, request, querystring, async, getsecret, ref$, exit_if_error, exit_with_error, log_success, lang, download_audio, main, slice$ = [].slice;
  fs = require('fs');
  request = require('request');
  querystring = require('querystring');
  async = require('async');
  getsecret = require('getsecret');
  ref$ = require('logutils'), exit_if_error = ref$.exit_if_error, exit_with_error = ref$.exit_with_error, log_success = ref$.log_success;
  lang = 'en';
  download_audio = function(query, callback){
    var extension, outfile, cookie_jar, google_translate_cookie, url, user_agent, headers;
    extension = 'mp3';
    outfile = "www/speechsynth_en/" + query + "." + extension;
    if (fs.existsSync(outfile)) {
      log_success({
        skipped_reason: 'already_exists',
        outfile: outfile
      });
      callback(null, outfile);
      return;
    }
    cookie_jar = request.jar();
    google_translate_cookie = getsecret('google_translate_cookie');
    if (google_translate_cookie != null) {
      cookie_jar.setCookie(google_translate_cookie, 'http://translate.google.com');
      cookie_jar.setCookie(google_translate_cookie, 'https://translate.google.com');
    } else {
      console.log('warning: google_translate_cookie not set in .getsecret.yaml - might get blocked');
    }
    url = 'https://translate.google.com/translate_tts?' + querystring.stringify({
      ie: 'UTF-8',
      tl: lang,
      q: query
    });
    user_agent = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36';
    headers = {
      'User-Agent': user_agent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Upgrade-Insecure-Requests': '1'
    };
    return request.get({
      url: url,
      jar: cookie_jar,
      encoding: null,
      headers: headers
    }, function(err2, res2, data){
      var content_type, content_type_to_extension, extension, outfile;
      exit_if_error(err2);
      content_type = res2.headers['content-type'];
      content_type_to_extension = {
        'audio/mpeg': 'mp3'
      };
      extension = content_type_to_extension[content_type];
      if (extension == null) {
        exit_with_error({
          message: 'unexpected content type',
          'content-type': content_type,
          'url': url
        });
      }
      outfile = "www/speechsynth_en/" + query + "." + extension;
      fs.writeFileSync(outfile, data);
      log_success(outfile);
      return callback(null, outfile);
    });
  };
  main = function(){
    var queries, res$, i$, ref$, len$, x;
    queries = slice$.call(process.argv, 2);
    if (queries.length === 1 && queries[0] === 'getallnumbers') {
      res$ = [];
      for (i$ = 0, len$ = (ref$ = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]).length; i$ < len$; ++i$) {
        x = ref$[i$];
        res$.push(x.toString());
      }
      queries = res$;
    }
    if (queries.length === 0) {
      exit_with_error('please provide a term to synthesize as the argument');
    }
    if (!fs.existsSync("www/speechsynth_" + lang)) {
      exit_with_error('directory www/speechsynth_#{lang} does not exist, please run this script from the root of the edufeed directory');
    }
    return async.mapSeries(queries, download_audio, function(err, results){
      return process.exit();
    });
  };
  main();
}).call(this);
