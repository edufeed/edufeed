synthesize_word_cached = (wordpath, callback) ->
  video_tag = $('#synthesizeword')
  if video_tag.length == 0
    video_tag = $('<audio>').prop('id', 'synthesizeword').css({display: 'none'})
    $('body').append video_tag
  play_audio = ->
    video_tag[0].removeEventListener('canplaythrough', play_audio)
    video_tag[0].currentTime = 0
    video_tag[0].play()
  tag_finished_playing = ->
    video_tag[0].removeEventListener('ended', tag_finished_playing)
    if callback?
      callback()
  video_tag[0].addEventListener('canplaythrough', play_audio)
  video_tag[0].addEventListener('ended', tag_finished_playing)
  fetchAsDataURL wordpath, (dataurl) ->
    video_tag.attr 'src', dataurl

synthesize_word_uncached = (word, synth_lang, callback) ->
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
      synthesize_word_cached speechsynth_paths[word], callback
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
      synthesize_word_cached info.file, ->
        ncallback(null, null)
    else if info.callback? # call the given callback
      info.callback word_idx, prev_word, ->
        ncallback(null, null)
  , ->
    if done?
      done()

export play_wrong_sound = (callback) ->
  synthesize_word_cached 'wrong.mp3', callback
