(function(){
  RegisterActivity({
    is: 'example-activity',
    properties: {
      foo: {
        type: String,
        value: ''
      },
      bar: {
        type: String,
        value: ''
      }
    },
    S: function(pattern){
      return $(this.$$(pattern));
    },
    ready: function(){
      return this.S('#hoverspan').hover(function(){
        return $(this).css('background-color', 'yellow');
      });
    },
    showAlert: function(){
      return alert('button has been clicked');
    },
    finishTask: function(){
      return this.fire('task-finished', this);
    }
  });
}).call(this);
