(function(){
  var play_sound, synthesize_word_uncached, synthesize_word, synthesize_multiple_words, play_multiple_sounds, play_wrong_sound, play_success_sound, play_letter_sound, out$ = typeof exports != 'undefined' && exports || this;
  out$.play_sound = play_sound = function(wordpath, callback){
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
        return play_sound(speechsynth_paths[word], callback);
      } else {
        return synthesize_word_uncached(word, synth_lang, callback);
      }
    });
  };
  out$.synthesize_multiple_words = synthesize_multiple_words = function(wordlist, callbacks){
    var done, startword, endword, word_idx;
    if (callbacks == null) {
      callbacks = {};
    }
    if (typeof callbacks === 'function') {
      callbacks = {
        done: callbacks
      };
    }
    done = callbacks.done, startword = callbacks.startword, endword = callbacks.endword;
    word_idx = 0;
    return async.eachSeries(wordlist, function(info, ncallback){
      if (typeof info === 'string') {
        info = {
          word: info
        };
      } else if (typeof info === 'function') {
        info = {
          callback: info
        };
      }
      if (info.sound != null) {
        if (info.sound.indexOf('.mp3') === -1) {
          info.file = info.sound + '.mp3';
        } else {
          info.file = info.sound;
        }
      }
      if (info.word != null) {
        word_idx = word_idx + 1;
        if (startword != null) {
          startword(word_idx, info.word);
        }
        return synthesize_word(info.word, function(){
          if (endword != null) {
            endword(word_idx, info.word);
          }
          return ncallback(null, null);
        });
      } else if (info.pause != null) {
        return setTimeout(function(){
          return ncallback(null, null);
        }, info.pause);
      } else if (info.file != null) {
        return play_sound(info.file, function(){
          return ncallback(null, null);
        });
      } else if (info.letter != null) {
        return play_letter_sound(info.letter, function(){
          return ncallback(null, null);
        });
      } else if (info.callback != null) {
        return info.callback(word_idx, prev_word, function(){
          return ncallback(null, null);
        });
      }
    }, function(){
      if (done != null) {
        return done();
      }
    });
  };
  out$.play_multiple_sounds = play_multiple_sounds = synthesize_multiple_words;
  out$.play_wrong_sound = play_wrong_sound = function(callback){
    return play_sound('wrong.mp3', callback);
  };
  out$.play_success_sound = play_success_sound = function(callback){
    return play_sound('success.mp3', callback);
  };
  out$.play_letter_sound = play_letter_sound = function(letter, callback){
    return play_sound("lettersound/" + letter + ".mp3", callback);
  };
}).call(this);
