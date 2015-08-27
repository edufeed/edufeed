(function(){
  $(document).ready(function(){
    var params;
    params = getUrlParameters();
    $('#foodiv').text(params.foo);
    return $('#bardiv').text(params.bar);
  });
}).call(this);
