(function(){
  Polymer({
    is: 'share-button',
    showClassmates: function(){
      return getUsername(function(username){
        return getClassmates(username, function(classmates){
          var i$, len$, classmate, results$ = [];
          for (i$ = 0, len$ = classmates.length; i$ < len$; ++i$) {
            classmate = classmates[i$];
            results$.push(console.log(classmate));
          }
          return results$;
        });
      });
    }
  });
}).call(this);
