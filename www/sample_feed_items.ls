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

  bars =
    [{itemtype: 'bars', data: {level: levelnum}, social: {poster: 'dog'}} for levelnum in [0 to 2]]

  dots =
    [{itemtype: 'dots', data: data, social: {poster: 'mouse'}} for data in [{numdots: 7, targetformula: '_x_=_'}, {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]

  typeletter =
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]

  typeword =
    [{itemtype: 'typeword', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]

  balance =
    [{itemtype: 'iframe', data: {activitypage: 'balance.html', thumbnailpage: 'iframe-thumbnail-example.html', params: {number: number}}, social: {poster: 'mouse'}} for number in [1, 3, 50, 300]]

  admin =
    [{itemtype: 'admin', social: {poster: 'horse'}}]

  example =
    [{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}]

  iframe =
    [{itemtype: 'iframe', data: {activitypage: 'iframe-activity-example.html', thumbnailpage: 'iframe-thumbnail-example.html', params: {foo: 'somefooval', bar: 'somebarval'}}, social: {poster: 'mouse', finishedby: ['elephant']}}]

  lettervideos =
    [{itemtype: 'video', data: {videoid: videoid}, social: {poster: 'mouse'}} for videoid in ['y8pZ3F8KB_Y', 'F7WyPqms5x0', 'LnDxp5QNxmA', 'qdJwtaaTfb4', 'PMDpfPky054', 'CaywS_FK4wE', 'O96r1dZ4Nqg', 'ndf_-FJsPVk', 'yZbNMjwgEN8', 'GkcqRmdwKlE', 'DHRQXGTSvw0', 'YASqLUId4n8', 'xUOc-UwTVBA', 'LYyK7KurvMs', 'rpvtKnqu7-4', '3724uXedg0A', '-k4oiVaekT0', 'zQ7vvPa4pAk', 'McACiO5dwGM', '4PhbUhrI4KE', 'qmWTMNhtY9Q', 'NkniyCUWeF4', '8ovG9ptOjBw', 'RhA10WVTmHw', 'RJH2oMKPeaw', 'f-iL7k5jhCI']]

  defaults =
    dots ++ typeletter ++ typeword

  return {
    defaults
    admin
    example
    iframe
    bars
    dots
    typeletter
    lettervideos
    typeword
    balance
  }
