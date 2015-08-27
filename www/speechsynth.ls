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

export synthesize_multiple_words = (wordlist, callback) ->
  async.eachSeries wordlist, (word, ncallback) ->
    synthesize_word word, ->
      ncallback(null, null)
  , ->
    if callback?
      callback()

export play_wrong_sound = (callback) ->
  synthesize_word_cached 'wrong.mp3', callback
