(function(){
  var send_signup_info;
  send_signup_info = function(){
    var username, password, botcheck;
    username = $('#usernameinput').val().trim();
    if (username == null || username.length === 0) {
      $('#statusinfo').attr('class', 'bg-danger');
      $('#statusinfo').text('need username');
      return;
    }
    password = $('#passwordinput').val().trim();
    if (password == null || password.length === 0) {
      $('#statusinfo').attr('class', 'bg-danger');
      $('#statusinfo').text('need password');
      return;
    }
    botcheck = $('#botcheckinput').val().trim();
    if (botcheck == null || botcheck.length === 0) {
      $('#statusinfo').attr('class', 'bg-danger');
      $('#statusinfo').text('bot check failed');
      return;
    }
    $('#statusinfo').attr('class', 'bg-success');
    $('#statusinfo').text('Creating account, please wait');
    return $.ajax({
      type: 'POST',
      url: '/signup',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        username: username,
        password: password,
        botcheck: botcheck
      }),
      success: function(data){
        if (data.status === 'success') {
          return setUsername(username, function(){
            return setPassword(password, function(){
              $('#statusinfo').attr('class', 'bg-success');
              return $('#statusinfo').text(data.text);
            });
          });
        } else {
          $('#statusinfo').attr('class', 'bg-danger');
          $('#statusinfo').text(data.text);
          return console.log(data);
        }
      },
      error: function(data){
        $('#statusinfo').attr('class', 'bg-danger');
        $('#statusinfo').text('error: ' + JSON.stringify(data));
        return console.log(data);
      }
    });
  };
  $(document).ready(function(){
    $('#usernameinput').keydown(function(evt){
      if (evt.keyCode === 13) {
        return send_signup_info();
      }
    });
    $('#passwordinput').keydown(function(evt){
      if (evt.keyCode === 13) {
        return send_signup_info();
      }
    });
    $('#botcheckinput').keydown(function(evt){
      if (evt.keyCode === 13) {
        return send_signup_info();
      }
    });
    return $('#signup').click(function(){
      return send_signup_info();
    });
  });
}).call(this);
