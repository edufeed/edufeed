send_signup_info = ->
  username = $('#usernameinput').val().trim()
  if not username? or username.length == 0
    $('#statusinfo').attr('class', 'bg-danger')
    $('#statusinfo').text('need username')
    return
  password = $('#passwordinput').val().trim()
  if not password? or password.length == 0
    $('#statusinfo').attr('class', 'bg-danger')
    $('#statusinfo').text('need password')
    return
  $('#statusinfo').attr('class', 'bg-success')
  $('#statusinfo').text 'Creating account, please wait'
  $.ajax {
    type: 'POST'
    url: '/signup'
    dataType: 'json'
    contentType: 'application/json; charset=utf-8'
    data: JSON.stringify({username: username, password: password})
    success: (data) ->
      if data.status == 'success'
        setUsername username, ->
          setPassword password, ->
            $('#statusinfo').attr('class', 'bg-success')
            $('#statusinfo').text data.text
      else
        $('#statusinfo').attr('class', 'bg-danger')
        $('#statusinfo').text(data.text)
        console.log data
    error: (data) ->
      $('#statusinfo').attr('class', 'bg-danger')
      $('#statusinfo').text('error: ' + JSON.stringify(data))
      console.log data
  }

$(document).ready ->
  $('#usernameinput').keydown (evt) ->
    if evt.keyCode == 13
      send_signup_info()
  $('#passwordinput').keydown (evt) ->
    if evt.keyCode == 13
      send_signup_info()
  $('#signup').click ->
    send_signup_info()
