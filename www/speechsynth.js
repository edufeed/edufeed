(function(){
  var synthesize_word_cached, synthesize_word_uncached, synthesize_word, synthesize_multiple_words, play_wrong_sound, out$ = typeof exports != 'undefined' && exports || this;
  synthesize_word_cached = function(wordpath, callback){
    var video_tag, play_audio, tag_finished_playing;
    video_tag = $('#synthesizeword');
    if (video_tag.length === 0) {
      video_tag = $('<audio>').prop('id', 'synthesizeword').css({
        display: 'none'
      });
      $('body').append(video_tag);
    }
    play_audio = function(){
      video_tag[0].removeEventListener('canplaythrough', play_audio);
      video_tag[0].currentTime = 0;
      return video_tag[0].play();
    };
    tag_finished_playing = function(){
      video_tag[0].removeEventListener('ended', tag_finished_playing);
      if (callback != null) {
        return callback();
      }
    };
    video_tag[0].addEventListener('canplaythrough', play_audio);
    video_tag[0].addEventListener('ended', tag_finished_playing);
    return fetchAsDataURL(wordpath, function(dataurl){
      return video_tag.attr('src', dataurl);
    });
  };
  synthesize_word_uncached = function(word, synth_lang, callback){
    var msg, speechsynth_finished_playing;
    msg = new SpeechSynthesisUtterance();
    msg.text = word;
    msg.lang = 'en-US';
    speechsynth_finished_playing = function(){
      msg.removeEventListener('end', speechsynth_finished_playing);
      if (callback != null) {
        return callback();
      }
    };
    msg.addEventListener('end', speechsynth_finished_playing);
    return speechSynthesis.speak(msg);
  };
  out$.synthesize_word = synthesize_word = function(word, callback){
    var synth_lang;
    synth_lang = 'en';
    return get_speechsynth_paths(function(speechsynth_paths){
      if (speechsynth_paths[word] != null) {
        return synthesize_word_cached(speechsynth_paths[word], callback);
      } else {
        return synthesize_word_uncached(word, synth_lang, callback);
      }
    });
  };
  out$.synthesize_multiple_words = synthesize_multiple_words = function(wordlist, callback){
    return async.eachSeries(wordlist, function(word, ncallback){
      return synthesize_word(word, function(){
        return ncallback(null, null);
      });
    }, function(){
      if (callback != null) {
        return callback();
      }
    });
  };
  out$.play_wrong_sound = play_wrong_sound = function(callback){
    return synthesize_word_cached('wrong.mp3', callback);
  };
}).call(this);
