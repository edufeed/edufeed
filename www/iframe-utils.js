(function(){
  var getUrlParameters, sendmessage, addlog, sendSampleLogs, leaveActivity, finishActivity, out$ = typeof exports != 'undefined' && exports || this;
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
  out$.sendmessage = sendmessage = function(messagetype, data){
    return parent.postMessage({
      messagetype: messagetype,
      data: data
    }, '*');
  };
  out$.addlog = addlog = function(data){
    return sendmessage('addlog', data);
  };
  out$.sendSampleLogs = sendSampleLogs = function(){
    return addlog({
      somemessage: 'barbar',
      bax: 'qux'
    });
  };
  out$.leaveActivity = leaveActivity = function(){
    return sendmessage('task-left');
  };
  out$.finishActivity = finishActivity = function(){
    return sendmessage('task-finished');
  };
}).call(this);
