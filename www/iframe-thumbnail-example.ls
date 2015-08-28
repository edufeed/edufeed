$(document).ready ->
  params = getUrlParameters()
  if params.activitypage?
    $('#activitypage').text(params.activitypage)
    delete params.activitypage
  if params.activityurl?
    $('#activityurl').text(params.activityurl)
    delete params.activityurl
  $('#paramsdisplay').text(JSON.stringify(params, null, 2))
