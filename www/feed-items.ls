export makeActivity = (item) ->
  {itemtype, data, social} = item
  activity = itemtype + '-activity'
  output = $("<#{activity}>")
  setPropDict output, data
  if social?
    output[0].social = social
  return output

export makeThumbnail = (item) ->
  {itemtype, data, social} = item
  thumbnail = itemtype + '-thumbnail'
  output = $("<#{thumbnail} id='thumbnail'>")
  setPropDict output, data
  if social?
    output[0].social = social
  return output

export makeSocialThumbnail = (item) ->
  {itemtype, data, social} = item
  username <~ getUsername()
  thumbnail = makeThumbnail item
  output = $('<social-thumbnail>').css({'margin-left': '5px', 'margin-right': '5px', 'margin-top': '5px'})
  wrapper = output.find('#thumbnailwrapper')
  wrapper.html('')
  thumbnail.appendTo wrapper
  setPropDict output, social
  if social? and social.finishedby? and social.finishedby.indexOf(username) != -1
    output.prop 'finished', true
  return output
