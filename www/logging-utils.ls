export getActivityName = ->
  activity = $('#activity')
  if activity? and activity.children?
    children = activity.children()
    if children? and children.length > 0
      tag = children[0]
      if tag.tagName?
        return tag.tagName.toLowerCase().split('-activity').join('')
  return 'side-scroll-feed'

export getActivityTag = ->
  activity_name = getActivityName()
  if activity_name == 'side-scroll-feed'
    return $('side-scroll-feed')[0]
  else
    return $('#activity').children()[0]

loginfo = {}
export addlog = (postdata, callback) ->
  output = {} <<< postdata
  db = getDb 'logs', {replicatetoremote: true}
  if not output.username?
    output.username = 'guestuser'
  output.posttime = Date.now()
  if not loginfo.sessionstart?
    loginfo.sessionstart = Date.now()
  activity_name = getActivityName()
  activity_tag = getActivityTag()
  if activity_name == 'side-scroll-feed'
    output.itemtype = 'side-scroll-feed'
    output.feeditems = activity_tag.items
  else
    {itemtype, data, social} = activity_tag.getalldata()
    output.itemtype = itemtype
    output.data = data
    output.social = social
  postItem 'logs', output, ->
    if callback?
      callback()
