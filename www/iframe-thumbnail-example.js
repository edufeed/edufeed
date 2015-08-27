(function(){
  var getUrlParameters, out$ = typeof exports != 'undefined' && exports || this;
  out$.getUrlParameters = getUrlParameters = function(){
    var url, hash, map, parts;
    url = window.location.href;
    hash = url.lastIndexOf('#');
    if (hash !== -1) {
      url = url.slice(0, hash);
    }
    map = {};
    parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value){
      return map[key] = decodeURIComponent(value).split('+').join(' ');
    });
    return map;
  };
  $(document).ready(function(){
    var params;
    params = getUrlParameters();
    $('#activitypage').text(params.activitypage);
    $('#activityurl').text(params.activityurl).prop('href', params.activityurl);
    return $('#paramsdisplay').text(JSON.stringify(params.params, null, 2));
  });
}).call(this);
