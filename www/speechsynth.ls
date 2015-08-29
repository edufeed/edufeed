current_play_id = null

get_new_play_id = ->
  play_id = Math.floor(Math.random() * 9999999999)
  current_play_id := play_id
  return play_id

export play_sound = (wordpath, callback) ->
  play_sound_real(get_new_play_id(), wordpath, callback)

play_sound_real = (play_id, wordpath, callback) ->
  callback_called = false
  if current_play_id != play_id
    if callback?
      callback()
    return
  console.log 'playing sound ' + wordpath
  soundtags = $('#soundtags')
  if soundtags.length == 0
    soundtags = $('<div>')
    $('body').append soundtags
  #soundtags.html('')
  video_id = 'videotag_' + play_id
  video_tag = $('#synthesizeword')
  if video_tag.length == 0
    video_tag = $('<audio>').prop('id', 'synthesizeword').css({display: 'none'})
    soundtags.append video_tag
  play_audio = ->
    if current_play_id != play_id
      $(video_tag).remove()
      if callback? and not callback_called
        callback_called := true
        callback()
      return
    video_tag[0].removeEventListener('canplaythrough', play_audio)
    video_tag[0].currentTime = 0
    video_tag[0].play()
  tag_finished_playing = ->
    video_tag[0].removeEventListener('ended', tag_finished_playing)
    #soundtags.html('')
    $(video_tag).remove()
    if callback? and not callback_called
      callback_called := true
      callback()
  video_tag[0].addEventListener('canplaythrough', play_audio)
  video_tag[0].addEventListener('ended', tag_finished_playing)
  fetchAsDataURL wordpath, (dataurl) ->
    if current_play_id != play_id
      $(video_tag).remove()
      if callback? and not callback_called
        callback_called := true
        callback()
      return
    video_tag.attr 'src', dataurl

synthesize_word_uncached = (word, synth_lang, callback) ->
  synthesize_word_uncached_real(get_new_play_id(), word, synth_lang, callback)

synthesize_word_uncached_real = (play_id, word, synth_lang, callback) ->
  if current_play_id != play_id
    if callback?
      callback()
    return
  console.log 'word is not cached: ' + word
  msg = new SpeechSynthesisUtterance()
  msg.text = word
  msg.lang = 'en-US'
  speechsynth_finished_playing = ->
    msg.removeEventListener('end', speechsynth_finished_playing)
    if callback?
      callback()
  msg.addEventListener('end', speechsynth_finished_playing)
  speechSynthesis.speak(msg)

export synthesize_word = (word, callback) ->
  synthesize_word_real(get_new_play_id(), word, callback)

synthesize_word_real = (play_id, word, callback) ->
  if current_play_id != play_id
    if callback?
      callback()
    return
  synth_lang = 'en'
  word = word.trim()
  if ['', '?', '.', '!'].indexOf(word) != -1
    if callback?
      callback()
    return
  get_speechsynth_paths (speechsynth_paths) ->
    if speechsynth_paths[word]?
      play_sound_real play_id, speechsynth_paths[word], callback
    else
      synthesize_word_uncached_real play_id, word, synth_lang, callback

export synthesize_multiple_words = (wordlist, callbacks) ->
  synthesize_multiple_words_real(get_new_play_id(), wordlist, callbacks)

synthesize_multiple_words_real = (play_id, wordlist, callbacks) ->
  if not callbacks?
    callbacks = {}
  if typeof callbacks == 'function'
    callbacks = {done: callbacks}
  {done, startword, endword} = callbacks
  # startword: called when we start synthesizing a word. passed in (word_idx, word) as input
  # endword: called when we start synthesizing a word. passed in (word_idx, word) as input
  if current_play_id != play_id
    if done?
      done()
    return
  word_idx = 0
  async.eachSeries wordlist, (info, ncallback) ->
    if current_play_id != play_id
      ncallback(null, null)
      return
    if typeof(info) == 'string'
      info = {word: info}
    else if typeof(info) == 'function'
      info = {callback: info}
    if info.sound?
      if info.sound.indexOf('.mp3') == -1
        info.file = info.sound + '.mp3'
      else
        info.file = info.sound
    if info.word? # synthesize the given word
      if startword?
        startword(word_idx, info.word)
      word_idx := word_idx + 1
      synthesize_word_real play_id, info.word, ->
        if endword?
          endword(word_idx, info.word)
        ncallback(null, null)
    else if info.pause? # pause for given milliseconds
      setTimeout ->
        ncallback(null, null)
      , info.pause
    else if info.file? # play the given file
      play_sound_real play_id, info.file, ->
        ncallback(null, null)
    else if info.letter? # play the given letter sound
      play_letter_sound_real play_id, info.letter, ->
        ncallback(null, null)
    else if info.callback? # call the given callback
      info.callback word_idx, prev_word, ->
        ncallback(null, null)
  , ->
    if done?
      done()

export play_multiple_sounds = synthesize_multiple_words

export play_wrong_sound = (callback) ->
  play_wrong_sound_real(get_new_play_id(), callback)

play_wrong_sound_real = (play_id, callback) ->
  play_sound_real play_id, 'wrong.mp3', callback

export play_success_sound = (callback) ->
  play_success_sound_real(get_new_play_id(), callback)

play_success_sound_real = (play_id, callback) ->
  play_sound_real play_id, 'success.mp3', callback

export play_letter_sound = (letter, callback) ->
  play_letter_sound_real(get_new_play_id(), letter, callback)

play_letter_sound_real = (play_id, letter, callback) ->
  play_sound_real play_id, "lettersound/#{letter}.mp3", callback
