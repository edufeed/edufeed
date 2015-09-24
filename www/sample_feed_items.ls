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

export getPosterLists = ->
  {
    'classa':
      [
        'tablet'
      ]

    'classb':
      [
        'tablet'
        'teacherb'
      ]

    'classc':
      [
        'tablet'
        'teacherc'
      ]

    'classtest':
      [
      'tablet'
      'teacherb'
      ]

    'other':
     [
        'tablet'
     ]
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
    [{itemtype: 'dots', data: data, social: {poster: 'tablet'}} for data in [{numdots: 4, targetformula: '1x2=_'}, {numdots: 4, targetformula: '2x1=_'}, {numdots: 4, targetformula: '3x1=_'}, {numdots: 4, targetformula: '3x2=_'} {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]

  typeletter =
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'tablet', finishedby: []}} for word in wordlist]

  typeword =
    [{itemtype: 'typeword', data: {word: word}, social: {poster: 'tablet', finishedby: []}} for word in wordlist]

  #balance =
  #  [{itemtype: 'iframe', data: {activitypage: 'balance.html', thumbnailpage: 'balance.html', params: {number: number}}, social: {poster: 'tablet'}} for number in [1, 3, 9, 20, 34, 100]]

  balance =
    [{itemtype: 'balance', data: {number: number}, social: {poster: 'tablet'}} for number in [1, 2, 3, 5, 10, 14, 57, 129, 206, 329, 453, 511, 933]]

  addition =
    [{itemtype: 'addition', data: {sum: sumval, add: addval}, social: {poster: 'tablet'}} for [addval, sumval] in [[1,2], [1,3], [1,5], [2,4], [2,6], [2,10], [3,6], [3,9], [4,7], [4,8], [5,6], [6,9], [5,10]]]

  subtraction =
    [{itemtype: 'subtraction', data: {diff: diffval, sub: subval}, social: {poster: 'tablet'}} for [subval, diffval] in [[2,1], [3,1], [5,1], [4,2], [6,2], [10,4], [6,3], [9,3], [9,4], [10,5], [10,3]]]

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
    #dots
    typeword
    typeletter
    #readaloud
    balance
    addition
    subtraction
    #lettervideo
    #numbervideo
    fillblank
    fillblanksocial
    #admin
    #example
    #iframe
  }

  return all_feed_items_cache

feed_items_cache = null

export chooseRandomPoster = (classtype) ->
  if classtype == 'tablet'
    return classtype
  classPosterLists = getPosterLists()
  classPosters = []
  if classPosterLists[classtype] == undefined
    classPosters = classPosterLists['other']
  else
    classPosters = classPosterLists[classtype]
  randomPoster = classPosters[Math.floor(Math.random() * classPosters.length)]
  return randomPoster

export barsTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  bars =
    [{itemtype: 'bars', data: {level: levelnum}, social: {poster: randomPoster}} for levelnum in [0 to 2]]
  return bars

export dotsTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  dots =
    [{itemtype: 'dots', data: data, social: {poster: randomPoster}} for data in [{numdots: 4, targetformula: '1x2=_'}, {numdots: 4, targetformula: '2x1=_'}, {numdots: 4, targetformula: '3x1=_'}, {numdots: 4, targetformula: '3x2=_'} {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]
  return dots

export typeletterTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  wordlist = getFeedWordList()
  typeletter = 
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: randomPoster, finishedby: []}} for word in wordlist]
  return typeletter

export typewordTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  wordlist = getFeedWordList()
  typeword =
    [{itemtype: 'typeword', data: {word: word}, social: {poster: randomPoster, finishedby: []}} for word in wordlist]
  return typeword

export balanceTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  balance = 
    [{itemtype: 'balance', data: {number: number}, social: {poster: randomPoster}} for number in [1, 3, 9, 20, 34, 100]]
  return balance

export additionTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  addition = 
    [{itemtype: 'addition', data: {sum: sumval, add: addval}, social: {poster: randomPoster}} for [addval, sumval] in [[1,2], [1,3], [2,4]]]
  return addition

export subtractionTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  subtraction =
    [{itemtype: 'subtraction', data: {diff: diffval, sub: subval}, social: {poster: randomPoster}} for [subval, diffval] in [[2,1], [3,1], [4,2]]]
  return subtraction

export lettervideoTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  videolists = getFeedVideoLists()
  lettervideo =
    [{itemtype: 'video', data: {itemcategory: 'lettervideo', videoid: videoid}, social: {poster: randomPoster}} for videoid in videolists.lettervideo]
  return lettervideo

export numbervideoTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  videolists = getFeedVideoLists()
  numbervideo =
    [{itemtype: 'video', data: {itemcategory: 'numbervideo', videoid: videoid}, social: {poster: randomPoster}} for videoid in videolists.numbervideo]
  return numbervideo

export readaloudTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  readinglist = getFeedReadingList()
  readaloud =
    [{itemtype: 'readaloud', data: {sentences}, social: {poster: randomPoster}} for sentences in readinglist]
  return readaloud

export fillblankTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  fillblanklist = getFillBlankSentencesWithCategories()
  wordcategories = getWordCategories()
  fillblank =
    [{itemtype: 'fillblank', data: {sentence, wordoptions: wordcategories[category]}, social: {poster: randomPoster}} for [sentence, category] in fillblanklist]
  return fillblank

export fillblanksocialTasks = (classtype) ->
  randomPoster = chooseRandomPoster(classtype)
  fillblanklist = getFillBlankSentencesWithCategories()
  wordcategories = getWordCategories()
  fillblanksocial =
    [{itemtype: 'fillblanksocial', data: {sentence, wordoptions: wordcategories[category], firstentered: wordcategories[category][0]}, social: {poster: 'tablet'}} for [sentence, category] in fillblanklist]
  return fillblanksocial

export getSampleFeedItems = ->
  if feed_items_cache?
    return feed_items_cache
  wordlist = getFeedWordList()
  readinglist = getFeedReadingList()
  videolists = getFeedVideoLists()
  fillblanklist = getFillBlankSentencesWithCategories()
  wordcategories = getWordCategories()

  classA = 'classa'
  classB = 'classb'
  classC = 'classc'
  tablet = 'tablet'

  bars_a = barsTasks(classA)
  bars_b = barsTasks(classB)
  bars_c = barsTasks(classC)
  bars = barsTasks(tablet)

  dots_a = dotsTasks(classA)
  dots_b = dotsTasks(classB)
  dots_c = dotsTasks(classC)
  dots = dotsTasks(tablet)

  typeletter_a = typeletterTasks(classA)
  typeletter_b = typeletterTasks(classB)
  typeletter_c = typeletterTasks(classC)
  typeletter = typeletterTasks(tablet)
  
  typeword_a = typewordTasks(classA)
  typeword_b = typewordTasks(classB)
  typeword_c = typewordTasks(classC)
  typeword = typewordTasks(tablet)
  
  #balance =
  #  [{itemtype: 'iframe', data: {activitypage: 'balance.html', thumbnailpage: 'balance.html', params: {number: number}}, social: {poster: 'tablet'}} for number in [1, 3, 9, 20, 34, 100]]

  balance_a = balanceTasks(classA)
  balance_b = balanceTasks(classB)
  balance_c = balanceTasks(classC)
  balance = balanceTasks(tablet)
  
  addition_a = additionTasks(classA)
  addition_b = additionTasks(classB)
  addition_c = additionTasks(classC)
  addition = additionTasks(tablet)
  
  subtraction_a = subtractionTasks(classA)
  subtraction_b = subtractionTasks(classB)
  subtraction_c = subtractionTasks(classC)
  subtraction = subtractionTasks(tablet)

  lettervideo_a = lettervideoTasks(classA)
  lettervideo_b = lettervideoTasks(classB)
  lettervideo_c = lettervideoTasks(classC)
  lettervideo = lettervideoTasks(tablet)

  numbervideo_a = numbervideoTasks(classA)
  numbervideo_b = numbervideoTasks(classB)
  numbervideo_c = numbervideoTasks(classC)
  numbervideo = numbervideoTasks(tablet)
  
  readaloud_a = readaloudTasks(classA)
  readaloud_b = readaloudTasks(classB)
  readaloud_c = readaloudTasks(classC)
  readaloud = readaloudTasks(tablet)

  fillblank_a = fillblankTasks(classA)
  fillblank_b = fillblankTasks(classB)
  fillblank_c = fillblankTasks(classC)
  fillblank = fillblankTasks(tablet)

  fillblanksocial_a = fillblanksocialTasks(classA)
  fillblanksocial_b = fillblanksocialTasks(classB)
  fillblanksocial_c = fillblanksocialTasks(classC)
  fillblanksocial = fillblanksocialTasks(tablet)

  admin =
    [{itemtype: 'admin', social: {poster: 'tablet'}}]

  example =
    [{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'tablet', finishedby: []}}]

  iframe =
    [{itemtype: 'iframe', data: {activitypage: 'iframe-activity-example.html', thumbnailpage: 'iframe-thumbnail-example.html', params: {foo: 'somefooval', bar: 'somebarval'}}, social: {poster: 'tablet', finishedby: []}}]

  defaults =
    typeword.slice(0, 1) ++ balance.slice(0, 1) ++ addition.slice(0, 1) ++ subtraction.slice(0, 1) ++ fillblank.slice(0, 1) ++ fillblanksocial.slice(1, 2)
  
  defaults_a = 
    typeword_a.slice(0, 1) ++ balance_a.slice(0, 1) ++ addition_a.slice(0, 1) ++ subtraction_a.slice(0, 1) ++ fillblank_a.slice(0, 1) ++ fillblanksocial_a.slice(1, 2)
  
  defaults_b =
    typeword_b.slice(0, 1) ++ balance_b.slice(0, 1) ++ addition_b.slice(0, 1) ++ subtraction_b.slice(0, 1) ++ fillblank_b.slice(0, 1) ++ fillblanksocial_b.slice(1, 2)
  
  defaults_c =
    typeword_c.slice(0, 1) ++ balance_c.slice(0, 1) ++ addition_c.slice(0, 1) ++ subtraction_c.slice(0, 1) ++ fillblank_c.slice(0, 1) ++ fillblanksocial_c.slice(1, 2)
  
  feed_items_cache := {
    defaults
    defaults_a
    defaults_b
    defaults_c
    bars
    #dots
    typeword
    typeletter
    #readaloud
    balance
    addition
    subtraction
    #lettervideo
    #numbervideo
    fillblank
    fillblanksocial
    admin
    example
    iframe
  }

  return feed_items_cache
