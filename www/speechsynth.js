(function(){
  var current_play_id, get_new_play_id, stop_sound, play_sound, play_sound_real, synthesize_word_uncached, synthesize_word_uncached_real, synthesize_word, synthesize_word_real, synthesize_multiple_words, synthesize_multiple_words_real, play_multiple_sounds, play_wrong_sound, play_wrong_sound_real, play_success_sound, play_success_sound_real, play_letter_sound, play_letter_sound_real, out$ = typeof exports != 'undefined' && exports || this;
  current_play_id = null;
  get_new_play_id = function(){
    var play_id;
    play_id = Math.floor(Math.random() * 9999999999);
    current_play_id = play_id;
    return play_id;
  };
  out$.stop_sound = stop_sound = function(){
    get_new_play_id();
    return $('#soundtags').html('');
  };
  out$.play_sound = play_sound = function(wordpath, callback){
    return play_sound_real(get_new_play_id(), wordpath, callback);
  };
  play_sound_real = function(play_id, wordpath, callback){
    var callback_called, soundtags, video_id, video_tag, play_audio, tag_finished_playing;
    callback_called = false;
    if (current_play_id !== play_id) {
      if (callback != null) {
        callback();
      }
      return;
    }
    console.log('playing sound ' + wordpath);
    soundtags = $('#soundtags');
    if (soundtags.length === 0) {
      soundtags = $('<div>');
      $('body').append(soundtags);
    }
    video_id = 'videotag_' + play_id;
    video_tag = $('#synthesizeword');
    if (video_tag.length === 0) {
      video_tag = $('<audio>').prop('id', 'synthesizeword').css({
        display: 'none'
      });
      soundtags.append(video_tag);
    }
    play_audio = function(){
      if (current_play_id !== play_id) {
        $(video_tag).remove();
        if (callback != null && !callback_called) {
          callback_called = true;
          callback();
        }
        return;
      }
      video_tag[0].removeEventListener('canplaythrough', play_audio);
      video_tag[0].currentTime = 0;
      return video_tag[0].play();
    };
    tag_finished_playing = function(){
      video_tag[0].removeEventListener('ended', tag_finished_playing);
      $(video_tag).remove();
      if (callback != null && !callback_called) {
        callback_called = true;
        return callback();
      }
    };
    video_tag[0].addEventListener('canplaythrough', play_audio);
    video_tag[0].addEventListener('ended', tag_finished_playing);
    return fetchAsDataURL(wordpath, function(dataurl){
      if (current_play_id !== play_id) {
        $(video_tag).remove();
        if (callback != null && !callback_called) {
          callback_called = true;
          callback();
        }
        return;
      }
      return video_tag.attr('src', dataurl);
    });
  };
  synthesize_word_uncached = function(word, synth_lang, callback){
    return synthesize_word_uncached_real(get_new_play_id(), word, synth_lang, callback);
  };
  synthesize_word_uncached_real = function(play_id, word, synth_lang, callback){
    var msg, speechsynth_finished_playing;
    if (current_play_id !== play_id) {
      if (callback != null) {
        callback();
      }
      return;
    }
    console.log('word is not cached: ' + word);
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
    return synthesize_word_real(get_new_play_id(), word, callback);
  };
  synthesize_word_real = function(play_id, word, callback){
    var synth_lang;
    if (current_play_id !== play_id) {
      if (callback != null) {
        callback();
      }
      return;
    }
    synth_lang = 'en';
    word = word.trim();
    if (['', '?', '.', '!'].indexOf(word) !== -1) {
      if (callback != null) {
        callback();
      }
      return;
    }
    return get_speechsynth_paths(function(speechsynth_paths){
      if (speechsynth_paths[word] != null) {
        return play_sound_real(play_id, speechsynth_paths[word], callback);
      } else {
        return synthesize_word_uncached_real(play_id, word, synth_lang, callback);
      }
    });
  };
  out$.synthesize_multiple_words = synthesize_multiple_words = function(wordlist, callbacks){
    return synthesize_multiple_words_real(get_new_play_id(), wordlist, callbacks);
  };
  synthesize_multiple_words_real = function(play_id, wordlist, callbacks){
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
    if (current_play_id !== play_id) {
      if (done != null) {
        done();
      }
      return;
    }
    word_idx = 0;
    return async.eachSeries(wordlist, function(info, ncallback){
      if (current_play_id !== play_id) {
        ncallback(null, null);
        return;
      }
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
        if (startword != null) {
          startword(word_idx, info.word);
        }
        word_idx = word_idx + 1;
        return synthesize_word_real(play_id, info.word, function(){
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
        return play_sound_real(play_id, info.file, function(){
          return ncallback(null, null);
        });
      } else if (info.letter != null) {
        return play_letter_sound_real(play_id, info.letter, function(){
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
    return play_wrong_sound_real(get_new_play_id(), callback);
  };
  play_wrong_sound_real = function(play_id, callback){
    return play_sound_real(play_id, 'wrong.mp3', callback);
  };
  out$.play_success_sound = play_success_sound = function(callback){
    return play_success_sound_real(get_new_play_id(), callback);
  };
  play_success_sound_real = function(play_id, callback){
    return play_sound_real(play_id, 'success.mp3', callback);
  };
  out$.play_letter_sound = play_letter_sound = function(letter, callback){
    return play_letter_sound_real(get_new_play_id(), letter, callback);
  };
  play_letter_sound_real = function(play_id, letter, callback){
    return play_sound_real(play_id, "lettersound/" + letter + ".mp3", callback);
  };
}).call(this);
