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
  playword: ->
    if not this.word? or this.word.length == 0
      return
    synthesize_word this.word
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
      if this.difficulty < 3
        this.difficulty += 1
      else
        setTimeout ~>
          this.fire 'task-finished', this
        , 1000
      setTimeout ~>
        this.playword()
      , 500
  shownKeysChanged: ->
    this.incorrect = 0
    keyboard = this.$$('#keyboard')
    next_letter = this.nextLetter()
    this.$$('#wordspan').highlightidx = 0
    keyboard.highlightkey = ''
    if this.difficulty == 0
      keyboard.shownkeys = next_letter
    if this.difficulty == 1
      keyboard.shownkeys = keyboard.getKeysInSameSection(next_letter) #this.word
    if this.difficulty == 2
      keyboard.shownkeys = [\a to \z].join('')
    if this.difficulty == 3
      keyboard.shownkeys = [\a to \z].join('')
    if this.difficulty == 3
      this.$$('#wordspan').style.visibility = 'hidden'
    else
      this.$$('#wordspan').style.visibility = 'visible'
}
