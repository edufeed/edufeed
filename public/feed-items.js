// Generated by LiveScript 1.3.1
(function(){
  var makeActivity, makeThumbnail, makeSocialThumbnail, out$ = typeof exports != 'undefined' && exports || this;
  out$.makeActivity = makeActivity = function(item){
    var itemtype, data, activity, output;
    itemtype = item.itemtype, data = item.data;
    activity = itemtype + '-activity';
    output = $("<" + activity + ">");
    setPropDict(output, data);
    return output;
  };
  out$.makeThumbnail = makeThumbnail = function(item){
    var itemtype, data, thumbnail, output;
    itemtype = item.itemtype, data = item.data;
    thumbnail = itemtype + '-thumbnail';
    output = $("<" + thumbnail + " id='thumbnail'>");
    setPropDict(output, data);
    return output;
  };
  out$.makeSocialThumbnail = makeSocialThumbnail = function(item){
    var itemtype, data, social, thumbnail, output, wrapper;
    itemtype = item.itemtype, data = item.data, social = item.social;
    thumbnail = makeThumbnail(item);
    output = $('<social-thumbnail>').css({
      'margin-left': '5px',
      'margin-right': '5px'
    });
    wrapper = output.find('#thumbnailwrapper');
    wrapper.html('');
    thumbnail.appendTo(wrapper);
    setPropDict(output, social);
    return output;
  };
}).call(this);
