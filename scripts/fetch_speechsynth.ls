# fetches the speech synth mp3 for the word, and writes it under www/speechsynth_en

require! {
  fs
  request
  querystring
  async
}

{exit_if_error, exit_with_error, log_success} = require 'logutils'

lang = 'en'

download_audio = (query, callback) ->
  url = 'http://speechsynth.herokuapp.com/speechsynth?' + querystring.stringify({word: query, lang: lang})
  request {url: url, encoding: null}, (err2, res2, data) ->
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
  if queries.length == 0
    exit_with_error 'please provide a term to synthesize as the argument'
  if not fs.existsSync("www/speechsynth_#{lang}")
    exit_with_error 'directory www/speechsynth_#{lang} does not exist, please run this script from the root of the edufeed directory'
  async.map queries, download_audio, (err, results) ->
    process.exit()

main()
