PropertyIntrospectionBehavior = {
  properties: {
    propertieslist: {
      type: Array
      value: []
    }
    social: {
      type: Object
      value: {}
    }
    itemtype: {
      type: String
      value: ''
    }
  }
  getdata: ->
    output = {}
    for x in this.propertieslist
      output[x] = this[x]
    return output
  getalldata: ->
    return {
      itemtype: this.itemtype
      data: this.getdata()
      social: this.social
    }
}

PolymerWithPropertyIntrospection = (activity_info) ->
  activity_info = {} <<< activity_info
  activity_name = activity_info.is
  property_names = []
  if not activity_info.behaviors?
    activity_info.behaviors = []
  activity_info.behaviors.push PropertyIntrospectionBehavior
  if not activity_info.properties?
    activity_info.properties = {}
  property_names = [k for k,v of activity_info.properties]
  if not activity_info.properties.propertieslist?
    activity_info.properties.propertieslist = {
      type: Array
      value: property_names
    }
  itemtype = activity_name.split('-activity').join('').split('-thumbnail').join('')
  activity_info.properties.itemtype = {
    type: String
    value: itemtype
  }
  Polymer(activity_info)

export RegisterActivity = PolymerWithPropertyIntrospection
export RegisterThumbnail = PolymerWithPropertyIntrospection
