export makeActivity = (item) ->
  {itemtype} = item
  {activity} = itemtypes[itemtype]
  if not activity?
    activity = itemtype + '-activity'
  output = $("<#{activity}>")
  for k,v of item
    output.prop k, v
  return output

export makeThumbnail = (item) ->
  {itemtype} = item
  {thumbnail} = itemtypes[itemtype]
  if not thumbnail?
    thumbnail = itemtype + '-thumbnail'
  output = $("<#{thumbnail}>")
  for k,v of item
    output.prop k, v
  return output

export itemtypes = {
  typeword: {
    thumbnail: 'typeword-thumbnail'
    activity: 'typeword-activity'
  }
  example: {
    thumbnail: 'example-thumbnail'
    activity: 'example-activity'
  }
}
