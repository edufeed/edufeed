export getSampleFeedItems = ->
  wordlist = [
    'cat'
    'dog'
    'white'
    'black'
    'blue'
    'red'
    'bee'
    'bird'
    'lion'
    'tiger'
    'fish'
    'city'
    'house'
    'roof'
    'tree'
    'river'
    'apple'
    'banana'
    'cherry'
    'orange'
    'pear'
  ]
  bars = (
    [{itemtype: 'bars', data: {level: levelnum}, social: {poster: 'dog'}} for levelnum in [0 to 2]]
  )
  dots = (
    [{itemtype: 'dots', data: data, social: {poster: 'mouse'}} for data in [{numdots: 7, targetformula: '_x_=_'}, {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]
  )
  typeletter = (
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]
  )
  typeword = (
    [{itemtype: 'typeword', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]
  )
  admin = (
    [{itemtype: 'admin', social: {poster: 'horse'}}]
  )
  example = (
    [{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}]
  )
  defaults = (
    dots ++ typeletter ++ typeword
  )
  return {
    defaults
    admin
    example
    bars
    dots
    typeletter
    typeword
  }
