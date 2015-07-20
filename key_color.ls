export getKeyColor = (key, keysound) ->
  cvowel = 'yellow'
  csemivowel = '#FFA500' # orange
  cnasal = '#FF5533' # red
  cstop = '#77AAFF' # blue
  cstop_voiced = '#5577FF'
  cfricative = '#AAFFAA' # green
  cfricative_voiced = '#00FF00'
  cstop_voiced = cstop
  cfricative_voiced = cfricative
  if key == 'c' or key == 'g'
    return '#00FFFF'
  if keysound == 'g_hard'
    return cstop_voiced
  if keysound == 'c_hard'
    return cstop
  if keysound == 'c_soft'
    return cfricative
  if keysound == 'g_soft'
    return cfricative_voiced
  if 'yw'.indexOf(key) != -1
    return csemivowel
  if 'aeoiuyw'.indexOf(key) != -1
    return cvowel
  if 'mnlr'.indexOf(key) != -1
    return cnasal
  if 'bdg'.indexOf(key) != -1
    return cstop_voiced
  if 'bpdtgkqxc'.indexOf(key) != -1
    return cstop
  if 'vzjg'.indexOf(key) != -1
    return cfricative_voiced
  if 'fvszcjhg'.indexOf(key) != -1
    return cfricative