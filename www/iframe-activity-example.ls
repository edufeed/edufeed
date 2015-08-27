$(document).ready ->
  params = getUrlParameters()
  $('#foodiv').text(params.foo)
  $('#bardiv').text(params.bar)
