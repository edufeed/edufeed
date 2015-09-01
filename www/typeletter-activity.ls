RegisterActivity {
  is: 'typeletter-activity'
  properties: {
    word: {
      type: String
      value: ''
      observer: 'wordChanged'
    }
    letter: {
      type: String
      computed: 'getFirstLetter(word)'
    }
    difficulty: {
      type: Number
      value: 0
      #observer: 'shownKeysChanged'
    }
  }
  picturePressed: ->
    this.playword(false)
  get_instruction_playlist: ->
    return [
      'the word'
      this.word
      'starts with the letter'
      {letter: this.letter}
      'type the lettter'
      {letter: this.letter}
    ]
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
  getFirstLetter: (word) ->
    return word[0]
  wordChanged: ->
    console.log 'wordChanged'
    this.shownKeysChanged()
    this.disableKeyboard()
    this.playword false, ~>
      this.enableKeyboard()
  nextLetter: ->
    return this.word[0]
  disableKeyboard: ->
    this.$$('#keyboard').highlightkey = ''
    this.$$('#keyboard').style.opacity = 0.2
    this.style['pointer-events'] = 'none'
  enableKeyboard: ->
    this.$$('#keyboard').style.opacity = 1.0
    this.style['pointer-events'] = 'all'
  keyTyped: (evt, key) ->
    keyboard = this.$$('#keyboard')
    letter = key.keytext
    letter_sound = key.sound
    if not letter_sound? or letter_sound.length == 0
      letter_sound = letter
    next_letter = this.letter
    if letter != next_letter
      this.incorrect += 1
      this.disableKeyboard()
      play_multiple_sounds [
        {sound: 'wrong'}
        'you typed the letter'
        {letter: letter_sound}
        'instead type the letter'
        {letter: next_letter}
      ], ~>
        this.enableKeyboard()
        #newkeys = [x for x in keyboard.shownkeys.split('') when x != letter].join('')
        keyboard.highlightkey = next_letter
    if letter == next_letter # typed correctly
      if this.difficulty < 2
        this.difficulty += 1
        this.shownKeysChanged()
        this.disableKeyboard()
        play_multiple_sounds ([{letter: letter_sound}, {sound: 'success'}] ++ this.get_instruction_playlist()), ~>
          this.enableKeyboard()
      else
        this.disableKeyboard()
        play_multiple_sounds [
          {letter: letter_sound}
          {sound: 'success'}
          'you typed the letter'
          {letter: this.letter}
          'in'
          this.word
        ], ~>
          this.enableKeyboard()
          this.fire 'task-finished', this
  shownKeysChanged: ->
    console.log 'shownKeysChanged'
    this.incorrect = 0
    keyboard = this.$$('#keyboard')
    next_letter = this.nextLetter()
    this.$$('#wordspan').highlightidx = 0
    keyboard.highlightkey = ''
    if keyboard.hiddensounds.length > 0
      keyboard.hiddensounds = []
    if this.difficulty == 0
      keyboard.shownkeys = next_letter
    if this.difficulty == 1
      keyboard.shownkeys = keyboard.getKeysInSameSection(next_letter) #this.word
      if ['c', 'g'].indexOf(next_letter) == -1 and keyboard.shownkeys.indexOf('c') != -1
        if keyboard.shownkeys.indexOf('g') != -1
          keyboard.hiddensounds = ['c_soft', 'g_soft']
        else
          keyboard.hiddensounds = ['c_hard', 'g_hard']
    if this.difficulty == 2
      keyboard.shownkeys = [\a to \z].join('')
    if this.difficulty == 3
      keyboard.shownkeys = [\a to \z].join('')
    if this.difficulty == 3
      this.$$('#wordspan').style.visibility = 'hidden'
    else
      this.$$('#wordspan').style.visibility = 'visible'
}
