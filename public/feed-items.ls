export makeActivity = (item) ->
  {itemtype} = item
  {activity} = itemtypes[itemtype]
  if not activity?
    activity = itemtype + '-activity'
  output = $("<#{activity}>")
  if item.data?
    for k,v of item.data
      output.prop k, v
  return output

export makeThumbnail = (item) ->
  {itemtype} = item
  {thumbnail} = itemtypes[itemtype]
  if not thumbnail?
    thumbnail = itemtype + '-thumbnail'
  output = $("<#{thumbnail}>")
  if item.data?
    for k,v of item.data
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
