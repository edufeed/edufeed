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
      observer: 'shownKeysChanged'
    }
    partialword: {
      type: String
      value: ''
      observer: 'partialwordChanged'
    }
  }
  playword: (success) ->
    if not this.word? or this.word.length == 0
      return
    #synthesize_word this.word
    playlist = ['type the word', this.word]
    if success? and success == true
      playlist.unshift {file: 'success.mp3'}
    play_multiple_sounds playlist
  #ready: ->
  #  console.log 'practice word ready'
  #  this.playword()
  wordChanged: ->
    this.playword()
    this.shownKeysChanged()
  partialwordChanged: ->
    this.$$('#inputarea').innerText = this.partialword
    this.shownKeysChanged()
  keyTyped: (evt, key) ->
    keyboard = this.$$('#keyboard')
    letter = key.keytext
    next_letter = this.nextLetter()
    if letter != next_letter
      #keyboard.shownkeys = next_letter
      this.incorrect += 1
      play_multiple_sounds [
        {sound: 'wrong'}
        'you typed the letter'
        {letter: letter}
        'instead type the letter'
        {letter: next_letter}
      ]
      newkeys = [x for x in keyboard.shownkeys.split('') when x != letter].join('')
      keyboard.highlightkey = next_letter
      #keyboard.shownkeys = newkeys
    if letter == next_letter # typed correctly
      if this.partialword + letter == this.word # is last letter in word
        if this.difficulty < 2
          this.difficulty += 1
          play_letter_sound letter, ~>
            this.playword(true)
        else
          #window.location = 'https://www.google.com/search?site=&tbm=isch&q=' + this.word
          play_multiple_sounds [
            {letter: letter}
            {sound: 'success'}
            'you typed the word'
            this.word
          ], ~>
            this.fire 'task-finished', this
        this.partialword = ''
      else
        play_letter_sound letter
        this.partialword = this.partialword + letter
  nextLetter: ->
    if this.word == this.partialword or not this.word? or not this.partialword?
      return ''
    return this.word[this.partialword.length]
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
