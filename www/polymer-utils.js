(function(){
  var PropertyIntrospectionBehavior, PolymerWithPropertyIntrospection, RegisterActivity, RegisterThumbnail, out$ = typeof exports != 'undefined' && exports || this;
  PropertyIntrospectionBehavior = {
    properties: {
      propertieslist: {
        type: Array,
        value: []
      },
      social: {
        type: Object,
        value: {}
      },
      itemtype: {
        type: String,
        value: ''
      }
    },
    getdata: function(){
      var output, i$, ref$, len$, x;
      output = {};
      for (i$ = 0, len$ = (ref$ = this.propertieslist).length; i$ < len$; ++i$) {
        x = ref$[i$];
        output[x] = this[x];
      }
      return output;
    },
    getalldata: function(){
      return {
        itemtype: this.itemtype,
        data: this.getdata(),
        social: this.social
      };
    }
  };
  PolymerWithPropertyIntrospection = function(activity_info){
    var activity_name, property_names, res$, k, ref$, v, itemtype;
    activity_info = import$({}, activity_info);
    activity_name = activity_info.is;
    property_names = [];
    if (activity_info.behaviors == null) {
      activity_info.behaviors = [];
    }
    activity_info.behaviors.push(PropertyIntrospectionBehavior);
    if (activity_info.properties == null) {
      activity_info.properties = {};
    }
    res$ = [];
    for (k in ref$ = activity_info.properties) {
      v = ref$[k];
      res$.push(k);
    }
    property_names = res$;
    if (activity_info.properties.propertieslist == null) {
      activity_info.properties.propertieslist = {
        type: Array,
        value: property_names
      };
    }
    itemtype = activity_name.split('-activity').join('').split('-thumbnail').join('');
    activity_info.properties.itemtype = {
      type: String,
      value: itemtype
    };
    return Polymer(activity_info);
  };
  out$.RegisterActivity = RegisterActivity = PolymerWithPropertyIntrospection;
  out$.RegisterThumbnail = RegisterThumbnail = PolymerWithPropertyIntrospection;
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
