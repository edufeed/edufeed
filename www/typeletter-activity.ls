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
      observer: 'shownKeysChanged'
    }
  }
  playword: (success) ->
    if not this.word? or this.word.length == 0
      return
    #synthesize_word this.word
    playlist = [
      'type the letter'
      {file: "lettersound/#{this.letter}.mp3"}
      'in'
      this.word
    ]
    if success? and success
      playlist.unshift {file: 'success.mp3'}
    synthesize_multiple_words playlist
  getFirstLetter: (word) ->
    return word[0]
  wordChanged: ->
    this.playword()
    this.shownKeysChanged()
  nextLetter: ->
    return this.word[0]
  keyTyped: (evt, key) ->
    keyboard = this.$$('#keyboard')
    letter = key.keytext
    next_letter = this.letter
    if letter != next_letter
      this.incorrect += 1
      play_wrong_sound()
      newkeys = [x for x in keyboard.shownkeys.split('') when x != letter].join('')
      keyboard.highlightkey = next_letter
    if letter == next_letter # typed correctly
      if this.difficulty < 2
        this.difficulty += 1
        setTimeout ~>
          this.playword(true)
        , 500
      else
        setTimeout ~>
          synthesize_multiple_words [
            {file: 'success.mp3'}
            'you typed the letter'
            {file: "lettersound/#{this.letter}.mp3"}
            'in'
            this.word
          ]
        , 500
        setTimeout ~>
          this.fire 'task-finished', this
        , 1000
  shownKeysChanged: ->
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
