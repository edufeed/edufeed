all_feed_items_cache = null
export getAllFeedItems = ->
  if all_feed_items_cache?
    return all_feed_items_cache
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
  readinglist = [
    ['Why do elephants never forget?', 'Because nobody ever tells them anything!']
    ['What do you get when you cross a parrot with a centipede?', 'A walkie talkie!']
    ['What is the strongest animal?', 'A snail. He carries his house on his back!']
    ['What has six eyes but cannot see?', 'Three blind mice!']
  ]

  bars =
    [{itemtype: 'bars', data: {level: levelnum}, social: {poster: 'dog'}} for levelnum in [0 to 2]]

  dots =
    [{itemtype: 'dots', data: data, social: {poster: 'mouse'}} for data in [{numdots: 7, targetformula: '_x_=_'}, {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]

  typeletter =
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]

  typeword =
    [{itemtype: 'typeword', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]

  #balance =
  #  [{itemtype: 'iframe', data: {activitypage: 'balance.html', thumbnailpage: 'balance.html', params: {number: number}}, social: {poster: 'mouse'}} for number in [1, 3, 50, 300]]

  balance =
    [{itemtype: 'balance', data: {number: number}, social: {poster: 'mouse'}} for number in [1, 3, 5, 10, 20, 50, 100, 200, 300]]

  admin =
    [{itemtype: 'admin', social: {poster: 'horse'}}]

  example =
    [{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}]

  iframe =
    [{itemtype: 'iframe', data: {activitypage: 'iframe-activity-example.html', thumbnailpage: 'iframe-thumbnail-example.html', params: {foo: 'somefooval', bar: 'somebarval'}}, social: {poster: 'mouse', finishedby: ['elephant']}}]

  lettervideos =
    [{itemtype: 'video', data: {videoid: videoid}, social: {poster: 'mouse'}} for videoid in ['y8pZ3F8KB_Y', 'F7WyPqms5x0', 'LnDxp5QNxmA', 'qdJwtaaTfb4', 'PMDpfPky054', 'CaywS_FK4wE', 'O96r1dZ4Nqg', 'ndf_-FJsPVk', 'yZbNMjwgEN8', 'GkcqRmdwKlE', 'DHRQXGTSvw0', 'YASqLUId4n8', 'xUOc-UwTVBA', 'LYyK7KurvMs', 'rpvtKnqu7-4', '3724uXedg0A', '-k4oiVaekT0', 'zQ7vvPa4pAk', 'McACiO5dwGM', '4PhbUhrI4KE', 'qmWTMNhtY9Q', 'NkniyCUWeF4', '8ovG9ptOjBw', 'RhA10WVTmHw', 'RJH2oMKPeaw', 'f-iL7k5jhCI']]

  readaloud =
    [{itemtype: 'readaloud', data: {sentences}, social: {poster: 'mouse'}} for sentences in readinglist]

  defaults =
    dots ++ typeletter ++ typeword

  all_feed_items_cache := {
    defaults
    bars
    dots
    typeword
    typeletter
    readaloud
    balance
    lettervideos
    admin
    example
    iframe
  }

  return all_feed_items_cache

getItemsFinishedByUser = (username, all_finished_items) ->
  return all_finished_items.filter (item) ->
    item? and item.social? and item.social.finishedby? and item.social.finishedby.indexOf(username) != -1

itemNotInList = (item, itemlist) ->
  return [x for x in itemlist when itemtype_and_data_matches(item, x)].length == 0

export addNewItemSuggestions = (finished_item, current_feed_items, all_finished_items, callback) ->
  console.log finished_item
  console.log current_feed_items
  console.log all_finished_items
  username <- getUsername()
  itemtype = finished_item.itemtype
  available_items = getAllFeedItems()[itemtype]
  items_finished_by_user = getItemsFinishedByUser(username, all_finished_items)
  new_available_items = available_items.filter (item) ->
    itemNotInList(item, all_finished_items) and itemNotInList(item, current_feed_items)
  console.log new_available_items
  if new_available_items.length > 0
    newitem = new_available_items[0]
    postItemToSelf newitem, callback
  else
    if callback?
      callback()

feed_items_cache = null

export getSampleFeedItems = ->
  if feed_items_cache?
    return feed_items_cache
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
  readinglist = [
    ['Why do elephants never forget?', 'Because nobody ever tells them anything!']
    ['What do you get when you cross a parrot with a centipede?', 'A walkie talkie!']
    ['What is the strongest animal?', 'A snail. He carries his house on his back!']
    ['What has six eyes but cannot see?', 'Three blind mice!']
  ]

  bars =
    [{itemtype: 'bars', data: {level: levelnum}, social: {poster: 'dog'}} for levelnum in [0 to 2]]

  dots =
    [{itemtype: 'dots', data: data, social: {poster: 'mouse'}} for data in [{numdots: 7, targetformula: '_x_=_'}, {numdots: 4, targetformula: '3x4=_'}, {numdots: 6, targetformula: '_x6=18'}, {numdots: 5, targetformula: '3x_=15'}, {numdots: 8, targetformula: '_x_=24'}]]

  typeletter =
    [{itemtype: 'typeletter', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]

  typeword =
    [{itemtype: 'typeword', data: {word: word}, social: {poster: 'dog', finishedby: ['zebra']}} for word in wordlist]

  #balance =
  #  [{itemtype: 'iframe', data: {activitypage: 'balance.html', thumbnailpage: 'balance.html', params: {number: number}}, social: {poster: 'mouse'}} for number in [1, 3, 50, 300]]

  balance =
    [{itemtype: 'balance', data: {number: number}, social: {poster: 'mouse'}} for number in [1, 3, 50, 300]]

  admin =
    [{itemtype: 'admin', social: {poster: 'horse'}}]

  example =
    [{itemtype: 'example', data: {foo: 'somefooval', bar: 'somebarval'}, social: {poster: 'mouse', finishedby: ['elephant']}}]

  iframe =
    [{itemtype: 'iframe', data: {activitypage: 'iframe-activity-example.html', thumbnailpage: 'iframe-thumbnail-example.html', params: {foo: 'somefooval', bar: 'somebarval'}}, social: {poster: 'mouse', finishedby: ['elephant']}}]

  lettervideos =
    [{itemtype: 'video', data: {videoid: videoid}, social: {poster: 'mouse'}} for videoid in ['y8pZ3F8KB_Y', 'F7WyPqms5x0', 'LnDxp5QNxmA', 'qdJwtaaTfb4', 'PMDpfPky054', 'CaywS_FK4wE', 'O96r1dZ4Nqg', 'ndf_-FJsPVk', 'yZbNMjwgEN8', 'GkcqRmdwKlE', 'DHRQXGTSvw0', 'YASqLUId4n8', 'xUOc-UwTVBA', 'LYyK7KurvMs', 'rpvtKnqu7-4', '3724uXedg0A', '-k4oiVaekT0', 'zQ7vvPa4pAk', 'McACiO5dwGM', '4PhbUhrI4KE', 'qmWTMNhtY9Q', 'NkniyCUWeF4', '8ovG9ptOjBw', 'RhA10WVTmHw', 'RJH2oMKPeaw', 'f-iL7k5jhCI']]

  readaloud =
    [{itemtype: 'readaloud', data: {sentences}, social: {poster: 'mouse'}} for sentences in readinglist]

  defaults =
    dots[0 to 1] ++ typeletter[0 to 1] ++ typeword[0 to 1]

  feed_items_cache := {
    defaults
    bars
    dots
    typeword
    typeletter
    readaloud
    balance
    lettervideos
    admin
    example
    iframe
  }

  return feed_items_cache
