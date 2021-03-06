root = exports ? this

require! {
  express
  path
  getsecret
  throttle_call
  request
}

func_cache = require('func_cache_mongo')()

{couchdb_server, signup_user} = require('./couchdb_utils')

bing_api_key = getsecret 'bing_api_key'
Bing = require('node-bing-api')({accKey: bing_api_key})

app = express()

app.set 'port', (process.env.PORT || 8080)

app.use express.static(path.join(__dirname, 'www'))

app.use require('body-parser').json()

app.listen app.get('port'), '0.0.0.0'

# couchdb info

app.get '/getcouchserver', (req, res) ->
  res.send couchdb_server

# base64 caching proxy

get_binary_content = (url, callback) ->
  request {url: url, encoding: null}, (err, response, data) ->
    content_type = response.headers['content-type']
    callback(data, content_type)

get_binary_content_as_base64 = (url, callback) ->
  get_binary_content url, (data, content_type) ->
    encoded_content = new Buffer(data).toString('base64')
    callback "data:#{content_type};base64,#{encoded_content}"

get_binary_content_as_base64_cached = func_cache get_binary_content_as_base64, 'get_binary_content_as_base64'

# proxy

app.get '/proxybase64', (req, res) ->
  {url} = req.query
  if not url?
    res.send 'need url'
    return
  get_binary_content_as_base64_cached url, (data) ->
    res.send data

app.get '/proxy', (req, res) ->
  {url} = req.query
  if not url?
    res.send 'need url'
    return
  get_binary_content url, (data, content_type) ->
    res.setHeader 'Content-Type', content_type
    res.send data

# images

get_image_url = (query, callback) ->
  Bing.images query, {}, (error, res2, body) ->
    #callback body.d.results[0].MediaUrl
    if not body? or not body.d? or not body.d.results?
      callback []
      return
    callback [x.MediaUrl for x in body.d.results]
    #callback body.d.results

get_image_url_throttled = throttle_call get_image_url

get_image_url_cached = func_cache get_image_url, 'get_image_url'

get_image_url_cached_throttled = throttle_call get_image_url_cached

app.get '/image', (req, res) ->
  if not req.query.name?
    res.send 'mising name parameter'
    return
  get_image_url_cached_throttled req.query.name, (imgurl) ->
    res.send imgurl

get_imagedata_by_name = (query, callback) ->
  get_image_url query, (imgurls) ->
    if not imgurls? or imgurls.length == 0
      callback ''
      return
    imgurl = imgurls[0]
    get_binary_content_as_base64_cached imgurl, (imgdata) ->
      callback imgdata

get_imagedata_by_name_cached = func_cache get_imagedata_by_name, 'get_imagedata_by_name'

app.get '/imagedatabyname', (req, res) ->
  if not req.query.name?
    res.send 'mising name parameter'
    return
  get_imagedata_by_name_cached req.query.name, (imgdata) ->
    res.send imgdata

# feed items

app.get '/getfeeditems', (req, res) ->
  wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear']
  res.json([{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'geza'}}] ++ [{itemtype: 'typeword', data: {word: word}, social: {poster: 'someuser'}} for word in wordlist])


app.post '/signup', (req, res) ->
  {username, password, botcheck} = req.body
  if not username?
    res.send {status: 'error', text: 'missing username'}
    return
  if not password?
    res.send {status: 'error', text: 'missing password'}
    return
  if not botcheck? or botcheck != '7,000'
    res.send {status: 'error', text: 'bot check failed'}
    return
  allowed_letters = [\a to \z].join('')
  if [allowed_letters.indexOf(c) for c in username].indexOf(-1) != -1
    res.send {status: 'error', text: 'username should contain only lowercase letters a-z'}
    return
  if [allowed_letters.indexOf(c) for c in password].indexOf(-1) != -1
    res.send {status: 'error', text: 'password should contain only lowercase letters a-z'}
    return
  signup_user username, password, ->
    res.send {status: 'success', text: 'User account created'}
