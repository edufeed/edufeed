# fetches the first bing image for the argument, and writes it under www/images

require! {
  fs
  getsecret
  request
  async
}

{exit_if_error, exit_with_error, log_success} = require 'logutils'

bing_api_key = getsecret 'bing_api_key'
Bing = require('node-bing-api')({accKey: bing_api_key})

download_image = (query, callback) ->
  Bing.images query, {}, (err, res, body) ->
    exit_if_error err
    if not body? or not body.d? or not body.d.results?
      exit_with_error 'no results found'
    url = body.d.results[0].MediaUrl
    request {url: url, encoding: null}, (err2, res2, data) ->
      exit_if_error err2
      content_type = res2.headers['content-type']
      content_type_to_extension = {
        'image/jpeg': 'jpg'
        'image/png': 'png'
      }
      extension = content_type_to_extension[content_type]
      if not extension?
        exit_with_error {
          message: 'unexpected content type'
          'content-type': content_type
          'url': url
        }
      outfile = "www/images/#{query}.#{extension}"
      fs.writeFileSync outfile, data
      log_success outfile
      callback(null, outfile)

main = ->
  queries = process.argv[2 to]
  if queries.length == 0
    exit_with_error 'please provide a search term as the argument'
  if not fs.existsSync('www/images')
    exit_with_error 'directory www/images does not exist, please run this script from the root of the edufeed directory'
  async.map queries, download_image, (err, results) ->
    process.exit()

main()
