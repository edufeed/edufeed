(function(){
  var operation_names, operations, list_of_minimal_length, make_sequence_comparer, edit_sequence_simple, edit_sequence, out$ = typeof exports != 'undefined' && exports || this;
  operation_names = ['DELETE', 'INSERT', 'EQUAL'];
  operations = {};
  (function(){
    var i$, ref$, len$, i, x, results$ = [];
    for (i$ = 0, len$ = (ref$ = operation_names).length; i$ < len$; ++i$) {
      i = i$;
      x = ref$[i$];
      results$.push(operations[x] = i);
    }
    return results$;
  })();
  list_of_minimal_length = function(list_of_lists){
    var minimum_length_list, i$, len$, x;
    minimum_length_list = list_of_lists[0];
    for (i$ = 0, len$ = list_of_lists.length; i$ < len$; ++i$) {
      x = list_of_lists[i$];
      if (x.length < minimum_length_list.length) {
        minimum_length_list = x;
      }
    }
    return minimum_length_list;
  };
  make_sequence_comparer = function(newitems, olditems, isequal){
    var memoized_edit_sequences, edit_sequence_recursive, edit_sequence_recursive_real;
    memoized_edit_sequences = {};
    (function(){
      var i$, ref$, len$, i, results$ = [];
      for (i$ = 0, len$ = (ref$ = (fn$())).length; i$ < len$; ++i$) {
        i = ref$[i$];
        results$.push(memoized_edit_sequences[i] = {});
      }
      return results$;
      function fn$(){
        var i$, to$, results$ = [];
        for (i$ = 0, to$ = newitems.length; i$ <= to$; ++i$) {
          results$.push(i$);
        }
        return results$;
      }
    })();
    edit_sequence_recursive = function(newidx, oldidx){
      var cached_result;
      cached_result = memoized_edit_sequences[newidx][oldidx];
      if (cached_result != null) {
        return cached_result;
      }
      cached_result = edit_sequence_recursive_real(newidx, oldidx);
      memoized_edit_sequences[newidx][oldidx] = cached_result;
      return cached_result;
    };
    edit_sequence_recursive_real = function(newidx, oldidx){
      var output, candidates;
      output = [];
      if (newidx >= newitems.length) {
        if (oldidx >= olditems.length) {
          return [];
        } else {
          return [operations.DELETE].concat(edit_sequence_recursive(newidx, oldidx + 1));
        }
      }
      if (oldidx >= olditems.length) {
        if (newidx >= newitems.length) {
          return [];
        } else {
          return [operations.INSERT].concat(edit_sequence_recursive(newidx + 1, oldidx));
        }
      }
      if (isequal(newitems[newidx], olditems[oldidx])) {
        return [operations.EQUAL].concat(edit_sequence_recursive(newidx + 1, oldidx + 1));
      }
      candidates = [];
      candidates.push([operations.DELETE].concat(edit_sequence_recursive(newidx, oldidx + 1)));
      candidates.push([operations.INSERT].concat(edit_sequence_recursive(newidx + 1, oldidx)));
      return list_of_minimal_length(candidates);
    };
    return {
      edit_sequence_recursive: edit_sequence_recursive
    };
  };
  out$.edit_sequence_simple = edit_sequence_simple = function(newitems, olditems, isequal){
    var edits, x;
    edits = make_sequence_comparer(newitems, olditems, isequal).edit_sequence_recursive(0, 0);
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = edits).length; i$ < len$; ++i$) {
        x = ref$[i$];
        results$.push(operation_names[x]);
      }
      return results$;
    }());
  };
  out$.edit_sequence = edit_sequence = function(newitems, olditems, isequal){
    var edits, output, oldidx, newidx, i$, len$, x;
    edits = make_sequence_comparer(newitems, olditems, isequal).edit_sequence_recursive(0, 0);
    output = [];
    oldidx = 0;
    newidx = 0;
    for (i$ = 0, len$ = edits.length; i$ < len$; ++i$) {
      x = edits[i$];
      if (x === operations.EQUAL) {
        output.push({
          action: 'EQUAL',
          idx: newidx,
          item: newitems[newidx],
          oldidx: oldidx,
          olditem: olditems[oldidx]
        });
        newidx += 1;
        oldidx += 1;
      }
      if (x === operations.INSERT) {
        output.push({
          action: 'INSERT',
          idx: newidx,
          item: newitems[newidx]
        });
        newidx += 1;
      }
      if (x === operations.DELETE) {
        output.push({
          action: 'DELETE',
          idx: newidx,
          item: olditems[oldidx]
        });
        oldidx += 1;
      }
    }
    return output;
  };
}).call(this);
