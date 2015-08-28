export play_sound = (wordpath, callback) ->
  console.log 'playing sound ' + wordpath
  soundtags = $('#soundtags')
  if soundtags.length == 0
    soundtags = $('<div>')
    $('body').append soundtags
  #soundtags.html('')
  video_id = 'videotag_' + Math.floor(Math.random() * 9999999999)
  video_tag = $('#synthesizeword').attr('id', video_id)
  if video_tag.length == 0
    video_tag = $('<audio>').prop('id', 'synthesizeword').css({display: 'none'})
    soundtags.append video_tag
  play_audio = ->
    video_tag[0].removeEventListener('canplaythrough', play_audio)
    video_tag[0].currentTime = 0
    video_tag[0].play()
  tag_finished_playing = ->
    video_tag[0].removeEventListener('ended', tag_finished_playing)
    #soundtags.html('')
    $(video_tag).remove()
    if callback?
      callback()
  video_tag[0].addEventListener('canplaythrough', play_audio)
  video_tag[0].addEventListener('ended', tag_finished_playing)
  fetchAsDataURL wordpath, (dataurl) ->
    video_tag.attr 'src', dataurl

synthesize_word_uncached = (word, synth_lang, callback) ->
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
  synth_lang = 'en'
  get_speechsynth_paths (speechsynth_paths) ->
    if speechsynth_paths[word]?
      play_sound speechsynth_paths[word], callback
    else
      synthesize_word_uncached word, synth_lang, callback

export synthesize_multiple_words = (wordlist, callbacks) ->
  if not callbacks?
    callbacks = {}
  if typeof callbacks == 'function'
    callbacks = {done: callbacks}
  {done, startword, endword} = callbacks
  # startword: called when we start synthesizing a word. passed in (word_idx, word) as input
  # endword: called when we start synthesizing a word. passed in (word_idx, word) as input
  word_idx = 0
  async.eachSeries wordlist, (info, ncallback) ->
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
      word_idx := word_idx + 1
      if startword?
        startword(word_idx, info.word)
      synthesize_word info.word, ->
        if endword?
          endword(word_idx, info.word)
        ncallback(null, null)
    else if info.pause? # pause for given milliseconds
      setTimeout ->
        ncallback(null, null)
      , info.pause
    else if info.file? # play the given file
      play_sound info.file, ->
        ncallback(null, null)
    else if info.letter? # play the given letter sound
      play_letter_sound info.letter, ->
        ncallback(null, null)
    else if info.callback? # call the given callback
      info.callback word_idx, prev_word, ->
        ncallback(null, null)
  , ->
    if done?
      done()

export play_multiple_sounds = synthesize_multiple_words

export play_wrong_sound = (callback) ->
  play_sound 'wrong.mp3', callback

export play_success_sound = (callback) ->
  play_sound 'success.mp3', callback

export play_letter_sound = (letter, callback) ->
  play_sound "lettersound/#{letter}.mp3", callback
