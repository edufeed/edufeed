root = exports ? this

require! {
  express
  path
  getsecret
  throttle_call
}

func_cache = require('func_cache_mongo')()

bing_api_key = getsecret 'bing_api_key'
Bing = require('node-bing-api')({accKey: bing_api_key})

app = express()

app.set 'port', (process.env.PORT || 8080)

app.use express.static(path.join(__dirname, ''))

# images

get_image_url = (query, callback) ->
  Bing.images query, {}, (error, res2, body) ->
    #callback body.d.results[0].MediaUrl
    callback [x.MediaUrl for x in body.d.results]
    #callback body.d.results

get_image_url_throttled = throttle_call get_image_url

get_image_url_cached = func_cache get_image_url

get_image_url_cached_throttled = throttle_call get_image_url_cached

app.get '/image', (req, res) ->
  get_image_url_cached_throttled req.query.name, (imgurl) ->
    res.send imgurl

# example sentences

app.listen app.get('port'), '0.0.0.0'
