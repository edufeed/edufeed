operation_names = [
  'DELETE'
  'INSERT'
  'EQUAL'
]
operations = {}
do ->
  for x,i in operation_names
    operations[x] = i

list_of_minimal_length = (list_of_lists) ->
  minimum_length_list = list_of_lists[0]
  for x in list_of_lists
    if x.length < minimum_length_list.length
      minimum_length_list = x
  return minimum_length_list

make_sequence_comparer = (newitems, olditems, isequal) ->
  memoized_edit_sequences = {}
  do ->
    for i in [0 to newitems.length]
      memoized_edit_sequences[i] = {}

  edit_sequence_recursive = (newidx, oldidx) ->
    cached_result = memoized_edit_sequences[newidx][oldidx]
    if cached_result?
      return cached_result
    cached_result = edit_sequence_recursive_real(newidx, oldidx)
    memoized_edit_sequences[newidx][oldidx] = cached_result
    return cached_result

  edit_sequence_recursive_real = (newidx, oldidx) ->
    output = []
    if newidx >= newitems.length
      if oldidx >= olditems.length
        return []
      else
        return [operations.DELETE].concat edit_sequence_recursive(newidx, oldidx + 1)
    if oldidx >= olditems.length
      if newidx >= newitems.length
        return []
      else
        return [operations.INSERT].concat edit_sequence_recursive(newidx + 1, oldidx)
    if isequal(newitems[newidx], olditems[oldidx])
      return [operations.EQUAL].concat edit_sequence_recursive(newidx + 1, oldidx + 1)
    candidates = []
    candidates.push [operations.DELETE].concat edit_sequence_recursive(newidx, oldidx + 1)
    candidates.push [operations.INSERT].concat edit_sequence_recursive(newidx + 1, oldidx)
    return list_of_minimal_length(candidates)

  return {
    edit_sequence_recursive
  }

export edit_sequence_simple = (newitems, olditems, isequal) ->
  edits = make_sequence_comparer(newitems, olditems, isequal).edit_sequence_recursive(0, 0)
  return [operation_names[x] for x in edits]

export edit_sequence = (newitems, olditems, isequal) ->
  edits = make_sequence_comparer(newitems, olditems, isequal).edit_sequence_recursive(0, 0)
  output = []
  oldidx = 0
  newidx = 0
  for x in edits
    if x == operations.EQUAL
      output.push {action: 'EQUAL', idx: newidx, item: newitems[newidx], oldidx: oldidx, olditem: olditems[oldidx]}
      newidx += 1
      oldidx += 1
    if x == operations.INSERT
      output.push {action: 'INSERT', idx: newidx, item: newitems[newidx]}
      newidx += 1
    if x == operations.DELETE
      output.push {action: 'DELETE', idx: newidx, item: olditems[oldidx]}
      oldidx += 1
  return output

# console.log edit_sequence(<[ a b c d e g ]>, <[ b c e f g ]>, (==))
