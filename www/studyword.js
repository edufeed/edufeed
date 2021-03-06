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
  window.addEventListener('WebComponentsReady', function(e){
    var params, word, ref$;
    params = getUrlParameters();
    word = (ref$ = params.word) != null ? ref$ : 'dog';
    return $('practice-word').prop('word', word);
  });
}).call(this);
