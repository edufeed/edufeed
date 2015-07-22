root = exports ? this

require! {
  express
  path
  getsecret
  throttle_call
  deployd
}

func_cache = require('func_cache_mongo')()

bing_api_key = getsecret 'bing_api_key'
Bing = require('node-bing-api')({accKey: bing_api_key})

app = express()

server = require('http').createServer(app)
io = require('socket.io').listen server, {'log level': 0}

deployd.attach server, {
  socketIo: io
  env: process.env.NODE_ENV ? 'development'
  db: {
    connectionString: (
      process.env.MONGOHQ_URL ?
      process.env.MONGOLAB_URI ?
      process.env.MONGOSOUP_URL ?
      'mongodb://localhost:27017/default'
    )
  }
}

app.set 'port', (process.env.PORT || 8080)

app.use express.static(path.join(__dirname, 'static'))

server.listen app.get('port'), '0.0.0.0'

#server.resources = ['taskitems']
dpd = require('deployd/lib/internal-client').build server

#dpd = require('dpd-js-sdk')('http://localhost:8080', '')
#dpd.taskitems = dpd('taskitems')

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
  if not req.query.name?
    res.send 'mising name parameter'
    return
  get_image_url_cached_throttled req.query.name, (imgurl) ->
    res.send imgurl

# feed items

app.get '/gettaskitems', (req, res) ->
  dpd.taskitems.get (taskitems) ->
    res.send taskitems

app.get '/getfeeditems', (req, res) ->
  wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear']
  res.json([{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'geza'}}] ++ [{itemtype: 'typeword', data: {word: word}, social: {poster: 'someuser'}} for word in wordlist])

app.use server.handleRequest
