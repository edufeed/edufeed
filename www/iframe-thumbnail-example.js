(function(){
  $(document).ready(function(){
    var params;
    params = getUrlParameters();
    if (params.activitypage != null) {
      $('#activitypage').text(params.activitypage);
      delete params.activitypage;
    }
    if (params.activityurl != null) {
      $('#activityurl').text(params.activityurl);
      delete params.activityurl;
    }
    return $('#paramsdisplay').text(JSON.stringify(params, null, 2));
  });
}).call(this);
