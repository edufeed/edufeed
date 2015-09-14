export getFeedWordList = ->
  [
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

export getFeedReadingList = ->
  [
    ['Why do elephants never forget?', 'Because nobody ever tells them anything!']
    ['What do you get when you cross a parrot with a centipede?', 'A walkie talkie!']
    ['What is the strongest animal?', 'A snail. He carries his house on his back!']
    ['What has six eyes but cannot see?', 'Three blind mice!']
  ]

export getFillBlankSentencesWithCategories = ->
  [
    ['My favorite color is ________.', 'color']
    ['My favorite animal is the ________.', 'animal']
    ['My favorite fruit is the ________.', 'fruit']
  ]

export getWordCategories = ->
  {
    'color': [
      'red'
      'blue'
      'black'
      'white'
    ]
    'animal': [
      'cat'
      'dog'
      'bee'
      'bird'
      'lion'
      'tiger'
      'fish'
    ]
    'fruit': [
      'apple'
      'banana'
      'cherry'
      'orange'
      'pear'
    ]
  }

export getFeedVideoLists = ->
  {
    lettervideo: ['y8pZ3F8KB_Y', 'F7WyPqms5x0', 'LnDxp5QNxmA', 'qdJwtaaTfb4', 'PMDpfPky054', 'CaywS_FK4wE', 'O96r1dZ4Nqg', 'ndf_-FJsPVk', 'yZbNMjwgEN8', 'GkcqRmdwKlE', 'DHRQXGTSvw0', 'YASqLUId4n8', 'xUOc-UwTVBA', 'LYyK7KurvMs', 'rpvtKnqu7-4', '3724uXedg0A', '-k4oiVaekT0', 'zQ7vvPa4pAk', 'McACiO5dwGM', '4PhbUhrI4KE', 'qmWTMNhtY9Q', 'NkniyCUWeF4', '8ovG9ptOjBw', 'RhA10WVTmHw', 'RJH2oMKPeaw', 'f-iL7k5jhCI']
    numbervideo: ['pbRU3lsGS0M', 'IiwqgDfJyXQ', 'VW2MREqE-_I', 'eyi0179wpE0', 'dpMP78dU5gQ', 'aKZlJ-tZo1Y', 'sXhM7AfctNU', 'X5A9PKY2FYk', 'upx7UwL4Pws', 'whHJ-WTEu_4']
  }

all_feed_items_cache = null
export getAllFeedItems = ->
  if all_feed_items_cache?
    return all_feed_items_cache
  wordlist = getFeedWordList()
  readinglist = getFeedReadingList()
  videolists = getFeedVideoLists()
  fillblanklist = getFillBlankSentencesWithCategories()
  wordcategories = getWordCategories()

  bars =
    [{itemtype: 'bars', data: {level: levelnum}, social: {poster: 'tablet'}} for levelnum in [0 to 2]]

  dots =
    [{itemtype: 'dots', data: data, social: {poster: 'tablet'}} for data in [{numdots: 7, targetformula: '_x_=_'}, {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]

  typeletter =
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'tablet', finishedby: []}} for word in wordlist]

  typeword =
    [{itemtype: 'typeword', data: {word: word}, social: {poster: 'tablet', finishedby: []}} for word in wordlist]

  #balance =
  #  [{itemtype: 'iframe', data: {activitypage: 'balance.html', thumbnailpage: 'balance.html', params: {number: number}}, social: {poster: 'tablet'}} for number in [1, 3, 9, 20, 34, 100]]

  balance =
    [{itemtype: 'balance', data: {number: number}, social: {poster: 'tablet'}} for number in [1, 2, 3, 5, 10, 14, 57, 129, 206, 329, 453, 511, 933]]

  addition =
    [{itemtype: 'addition', data: {sum: sumval, add: addval}, social: {poster: 'tablet'}} for [addval, sumval] in [[1,2], [1,3], [1,5], [2,4], [2,6], [2,10], [3,6], [3,9], [5,10]]]

  admin =
    [{itemtype: 'admin', social: {poster: 'tablet'}}]

  example =
    [{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'tablet', finishedby: []}}]

  iframe =
    [{itemtype: 'iframe', data: {activitypage: 'iframe-activity-example.html', thumbnailpage: 'iframe-thumbnail-example.html', params: {foo: 'somefooval', bar: 'somebarval'}}, social: {poster: 'tablet', finishedby: []}}]

  lettervideo =
    [{itemtype: 'video', data: {itemcategory: 'lettervideo', videoid: videoid}, social: {poster: 'tablet'}} for videoid in videolists.lettervideo]

  numbervideo =
    [{itemtype: 'video', data: {itemcategory: 'numbervideo', videoid: videoid}, social: {poster: 'tablet'}} for videoid in videolists.numbervideo]

  readaloud =
    [{itemtype: 'readaloud', data: {sentences}, social: {poster: 'tablet'}} for sentences in readinglist]

  fillblank =
    [{itemtype: 'fillblank', data: {sentence, wordoptions: wordcategories[category]}, social: {poster: 'tablet'}} for [sentence, category] in fillblanklist]

  fillblanksocial =
    [{itemtype: 'fillblanksocial', data: {sentence, wordoptions: wordcategories[category], firstentered: wordcategories[category][0]}, social: {poster: 'tablet'}} for [sentence, category] in fillblanklist]
  
  #defaults =
  #  dots ++ typeletter ++ typeword

  all_feed_items_cache := {
    #defaults
    #bars
    dots
    typeword
    typeletter
    readaloud
    balance
    addition
    lettervideo
    numbervideo
    fillblank
    fillblanksocial
    #admin
    #example
    #iframe
  }

  return all_feed_items_cache

feed_items_cache = null

export getSampleFeedItems = ->
  if feed_items_cache?
    return feed_items_cache
  wordlist = getFeedWordList()
  readinglist = getFeedReadingList()
  videolists = getFeedVideoLists()
  fillblanklist = getFillBlankSentencesWithCategories()
  wordcategories = getWordCategories()

  bars =
    [{itemtype: 'bars', data: {level: levelnum}, social: {poster: 'tablet'}} for levelnum in [0 to 2]]

  dots =
    [{itemtype: 'dots', data: data, social: {poster: 'tablet'}} for data in [{numdots: 7, targetformula: '_x_=_'}, {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]

  typeletter =
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'tablet', finishedby: []}} for word in wordlist]

  typeword =
    [{itemtype: 'typeword', data: {word: word}, social: {poster: 'tablet', finishedby: []}} for word in wordlist]

  #balance =
  #  [{itemtype: 'iframe', data: {activitypage: 'balance.html', thumbnailpage: 'balance.html', params: {number: number}}, social: {poster: 'tablet'}} for number in [1, 3, 9, 20, 34, 100]]

  balance =
    [{itemtype: 'balance', data: {number: number}, social: {poster: 'tablet'}} for number in [1, 3, 9, 20, 34, 100]]

  addition =
    [{itemtype: 'addition', data: {sum: sumval, add: addval}, social: {poster: 'tablet'}} for [addval, sumval] in [[1,2], [1,3], [2,4]]]

  admin =
    [{itemtype: 'admin', social: {poster: 'tablet'}}]

  example =
    [{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'tablet', finishedby: []}}]

  iframe =
    [{itemtype: 'iframe', data: {activitypage: 'iframe-activity-example.html', thumbnailpage: 'iframe-thumbnail-example.html', params: {foo: 'somefooval', bar: 'somebarval'}}, social: {poster: 'tablet', finishedby: []}}]

  lettervideo =
    [{itemtype: 'video', data: {itemcategory: 'lettervideo', videoid: videoid}, social: {poster: 'tablet'}} for videoid in videolists.lettervideo]

  numbervideo =
    [{itemtype: 'video', data: {itemcategory: 'numbervideo', videoid: videoid}, social: {poster: 'tablet'}} for videoid in videolists.numbervideo]

  readaloud =
    [{itemtype: 'readaloud', data: {sentences}, social: {poster: 'tablet'}} for sentences in readinglist]

  fillblank =
    [{itemtype: 'fillblank', data: {sentence, wordoptions: wordcategories[category]}, social: {poster: 'tablet'}} for [sentence, category] in fillblanklist]

  fillblanksocial =
    [{itemtype: 'fillblanksocial', data: {sentence, wordoptions: wordcategories[category], firstentered: wordcategories[category][0]}, social: {poster: 'tablet'}} for [sentence, category] in fillblanklist]

  defaults =
    dots.slice(0, 1) ++ typeletter.slice(0, 1) ++ typeword.slice(0, 1) ++ balance.slice(0, 1) ++ addition.slice(0, 1) ++ lettervideo.slice(0, 1) ++ numbervideo.slice(0, 1) ++ readaloud.slice(0, 1) ++ fillblanksocial.slice(0, 1)

  feed_items_cache := {
    defaults
    bars
    dots
    typeword
    typeletter
    readaloud
    balance
    addition
    lettervideo
    numbervideo
    fillblank
    fillblanksocial
    admin
    example
    iframe
  }

  return feed_items_cache
