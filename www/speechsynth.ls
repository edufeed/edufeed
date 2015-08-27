export synthesize_word = (word) ->
  synth_lang = 'en'
  video_tag = $('#synthesizeword')
  if video_tag.length == 0
    video_tag = $('<audio>').prop('id', 'synthesizeword').css({display: 'none'})
    $('body').append video_tag
  play_audio = ->
    video_tag[0].currentTime = 0
    video_tag[0].play()
  video_tag[0].removeEventListener('canplaythrough', play_audio)
  video_tag[0].addEventListener('canplaythrough', play_audio)
  get_speechsynth_paths (speechsynth_paths) ->
    if speechsynth_paths[word]?
      fetchAsDataURL speechsynth_paths[word], (dataurl) ->
        video_tag.attr 'src', dataurl
    else
      #video_tag.attr 'src', 'http://speechsynth.herokuapp.com/speechsynth?' + $.param({lang: synth_lang, word})
      msg = new SpeechSynthesisUtterance()
      msg.text = word
      msg.lang = 'en-US'
      speechSynthesis.speak(msg)

export play_wrong_sound = ->
  synth_lang = 'en'
  video_tag = $('#synthesizeword')
  if video_tag.length == 0
    video_tag = $('<audio>').prop('id', 'synthesizeword').css({display: 'none'})
    $('body').append video_tag
  play_audio = ->
    video_tag[0].currentTime = 0
    video_tag[0].play()
  video_tag[0].removeEventListener('canplaythrough', play_audio)
  video_tag[0].addEventListener('canplaythrough', play_audio)
  fetchAsDataURL '/wrong.mp3', (dataurl) ->
    video_tag.attr 'src', dataurl
