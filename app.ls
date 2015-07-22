root = exports ? this

require! {
  deployd
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

server.listen()
