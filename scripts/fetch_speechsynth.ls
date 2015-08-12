# fetches the speech synth mp3 for the word, and writes it under www/speechsynth_en

require! {
  fs
  request
  querystring
  async
  getsecret
}

{exit_if_error, exit_with_error, log_success} = require 'logutils'

lang = 'en'

download_audio = (query, callback) ->
  #url = 'http://speechsynth.herokuapp.com/speechsynth?' + querystring.stringify({word: query, lang: lang})
  #request {url: url, encoding: null}, (err2, res2, data) ->
  extension = 'mp3'
  outfile = "www/speechsynth_en/#{query}.#{extension}"
  if fs.existsSync(outfile)
    log_success {skipped_reason: 'already_exists', outfile: outfile}
    callback(null, outfile)
    return
  cookie_jar = request.jar()
  google_translate_cookie = getsecret('google_translate_cookie')
  if google_translate_cookie?
    cookie_jar.setCookie(google_translate_cookie, 'http://translate.google.com')
    cookie_jar.setCookie(google_translate_cookie, 'https://translate.google.com')
  else
    console.log 'warning: google_translate_cookie not set in .getsecret.yaml - might get blocked'
  url = 'https://translate.google.com/translate_tts?' + querystring.stringify({ie: 'UTF-8', tl: lang, q: query})
  user_agent = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.130 Safari/537.36'
  headers = {
    'User-Agent': user_agent
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    'Upgrade-Insecure-Requests': '1'
  }
  request.get {url: url, jar: cookie_jar, encoding: null, headers: headers}, (err2, res2, data) ->
    exit_if_error err2
    content_type = res2.headers['content-type']
    content_type_to_extension = {
      'audio/mpeg': 'mp3'
    }
    extension = content_type_to_extension[content_type]
    if not extension?
      exit_with_error {
        message: 'unexpected content type'
        'content-type': content_type
        'url': url
      }
    outfile = "www/speechsynth_en/#{query}.#{extension}"
    fs.writeFileSync outfile, data
    log_success outfile
    callback(null, outfile)

main = ->
  queries = process.argv[2 to]
  if queries.length == 1 and queries[0] == 'getallnumbers'
    queries = [x.toString() for x in [0 to 100]]
  if queries.length == 0
    exit_with_error 'please provide a term to synthesize as the argument'
  if not fs.existsSync("www/speechsynth_#{lang}")
    exit_with_error 'directory www/speechsynth_#{lang} does not exist, please run this script from the root of the edufeed directory'
  async.mapSeries queries, download_audio, (err, results) ->
    process.exit()

main()
