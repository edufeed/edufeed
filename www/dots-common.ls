export parseMultiplicationProblem = (targetformula) ->
  numvars = targetformula.split('_').length - 1
  product = targetformula.split('=')[1] |> parseInt
  terms = targetformula.split('=')[0].split('x').map((x) -> parseInt(x))
  term1 = terms[0]
  term2 = terms[1]
  if numvars == 2
    task = 'both_terms'
    term1 = term2 = 0
  else if numvars == 1
    if !isFinite(product)
      task = 'product'
      product = term1 * term2
    else if !isFinite(term1)
      task = 'first_term'
      term1 = Math.round(product / term2)
    else if !isFinite(term2)
      task = 'second_term'
      term2 = Math.round(product / term1)
  else
    task = ''
    product = 0
    term1 = 0
    term2 = 0
  return {
    task
    term1
    term2
    product
  }
