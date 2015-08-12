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
      setTimeout ~>
        this.playword()
        this.fire 'task-finished', this
      , 1000
  shownKeysChanged: ->
    this.incorrect = 0
    keyboard = this.$$('#keyboard')
    this.$$('#wordspan').highlightidx = 0
    keyboard.shownkeys = [\a to \z].join('')
}
