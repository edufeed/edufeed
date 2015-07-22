root = exports ? this

require! {
  deployd
  asyncblock
}

server = deployd {
  port: (process.env.PORT || 8080)
  env: 'development' #process.env.NODE_ENV ? 'development'
  db: {
    connectionString: (
      process.env.MONGOHQ_URL ?
      process.env.MONGOLAB_URI ?
      process.env.MONGOSOUP_URL ?
      'mongodb://localhost:27017/default'
    )
  }
}

noerr = (f) ->
  (res) ->
    f(null, res)

server.on 'listening', ->
  dpd = require('deployd/lib/internal-client').build server
  dpd.taskitems.get (taskitems) ->
    if taskitems.length == 0
      wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear']
      asyncblock (flow) ->
        dpd.taskitems.post {itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'geza'}}, noerr(flow.add())
        flow.wait()
        for word in wordlist
          dpd.taskitems.post {itemtype: 'typeword', data: {word: word}, social: {poster: 'someuser'}}, noerr(flow.add())
          flow.wait()

server.listen()

