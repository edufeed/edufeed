(function(){
  var synthesize_word, play_wrong_sound, out$ = typeof exports != 'undefined' && exports || this;
  out$.synthesize_word = synthesize_word = function(word){
    var synth_lang, video_tag, play_audio;
    synth_lang = 'en';
    video_tag = $('#synthesizeword');
    if (video_tag.length === 0) {
      video_tag = $('<audio>').prop('id', 'synthesizeword').css({
        display: 'none'
      });
      $('body').append(video_tag);
    }
    play_audio = function(){
      video_tag[0].currentTime = 0;
      return video_tag[0].play();
    };
    video_tag[0].removeEventListener('canplaythrough', play_audio);
    video_tag[0].addEventListener('canplaythrough', play_audio);
    return get_speechsynth_paths(function(speechsynth_paths){
      var msg;
      if (speechsynth_paths[word] != null) {
        return fetchAsDataURL(speechsynth_paths[word], function(dataurl){
          return video_tag.attr('src', dataurl);
        });
      } else {
        msg = new SpeechSynthesisUtterance();
        msg.text = word;
        msg.lang = 'en-US';
        return speechSynthesis.speak(msg);
      }
    });
  };
  out$.play_wrong_sound = play_wrong_sound = function(){
    var synth_lang, video_tag, play_audio;
    synth_lang = 'en';
    video_tag = $('#synthesizeword');
    if (video_tag.length === 0) {
      video_tag = $('<audio>').prop('id', 'synthesizeword').css({
        display: 'none'
      });
      $('body').append(video_tag);
    }
    play_audio = function(){
      video_tag[0].currentTime = 0;
      return video_tag[0].play();
    };
    video_tag[0].removeEventListener('canplaythrough', play_audio);
    video_tag[0].addEventListener('canplaythrough', play_audio);
    return video_tag.attr('src', '/wrong.mp3');
  };
}).call(this);
