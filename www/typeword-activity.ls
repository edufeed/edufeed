RegisterActivity {
  is: 'typeword-activity'
  properties: {
    word: {
      type: String
      value: ''
      observer: 'wordChanged'
    }
    difficulty: {
      type: Number
      value: 0
      #observer: 'shownKeysChanged'
    }
    partialword: {
      type: String
      value: ''
      observer: 'partialwordChanged'
    }
  }
  picturePressed: ->
    this.playword(false)
  get_instruction_playlist: ->
    return [
      'spell the word'
      this.word
    ] ++ [{letter: letter} for letter in this.word]
  playword: (success, callback) ->
    if not this.word? or this.word.length == 0
      return
    #synthesize_word this.word
    playlist = this.get_instruction_playlist()
    if success? and success == true
      playlist.unshift {sound: 'success'}
    play_multiple_sounds playlist, ~>
      if callback?
        callback()
  #ready: ->
  #  console.log 'practice word ready'
  #  this.playword()
  wordChanged: ->
    this.shownKeysChanged()
    this.disableKeyboard()
    this.playword false, ~>
      this.enableKeyboard()
  partialwordChanged: ->
    this.$$('#inputarea').innerText = this.partialword
    this.shownKeysChanged()
  keyTyped: (evt, key) ->
    keyboard = this.$$('#keyboard')
    letter = key.keytext
    letter_sound = key.sound
    if not letter_sound? or letter_sound.length == 0
      letter_sound = letter
    next_letter = this.nextLetter()
    if letter != next_letter
      #keyboard.shownkeys = next_letter
      this.incorrect += 1
      this.disableKeyboard()
      play_multiple_sounds [
        'you touched the letter that makes the sound'
        {letter: letter_sound}
        'instead touch the letter that makes the sound'
        {letter: next_letter}
      ], ~>
        this.enableKeyboard()
        newkeys = [x for x in keyboard.shownkeys.split('') when x != letter].join('')
        keyboard.highlightkey = next_letter
        #keyboard.shownkeys = newkeys
    if letter == next_letter # typed correctly
      if this.partialword + letter == this.word # is last letter in word
        if this.difficulty < 2
          this.difficulty += 1
          this.shownKeysChanged()
          this.disableKeyboard()
          play_multiple_sounds ([{letter: letter_sound}, {sound: 'success'}] ++ this.get_instruction_playlist()), ~>
            this.enableKeyboard()
        else
          #window.location = 'https://www.google.com/search?site=&tbm=isch&q=' + this.word
          this.disableKeyboard()
          play_multiple_sounds [
            {letter: letter_sound}
            {sound: 'success'}
            'you spelled the word'
            this.word
          ], ~>
            this.enableKeyboard()
            this.fire 'task-finished', this
        this.partialword = ''
      else
        play_letter_sound letter_sound
        this.partialword = this.partialword + letter
  nextLetter: ->
    if this.word == this.partialword or not this.word? or not this.partialword?
      return ''
    return this.word[this.partialword.length]
  disableKeyboard: ->
    this.$$('#keyboard').highlightkey = ''
    this.$$('#keyboard').style.opacity = 0.2
    this.style['pointer-events'] = 'none'
  enableKeyboard: ->
    this.$$('#keyboard').style.opacity = 1.0
    this.style['pointer-events'] = 'all'
  shownKeysChanged: ->
    this.incorrect = 0
    keyboard = this.$$('#keyboard')
    next_letter = this.nextLetter()
    if this.partialword?
      this.$$('#wordspan').highlightidx = this.partialword.length
    keyboard.highlightkey = ''
    if this.difficulty == 0
      keyboard.shownkeys = next_letter
    if this.difficulty == 1
      keyboard.shownkeys = this.word
    if this.difficulty == 2
      keyboard.shownkeys = [\a to \z].join('')
    if this.difficulty == 3
      keyboard.shownkeys = [\a to \z].join('')
    if this.difficulty == 3
      this.$$('#wordspan').style.visibility = 'hidden'
    else
      this.$$('#wordspan').style.visibility = 'visible'
    #keyboard.shownkeys = this.word
}
