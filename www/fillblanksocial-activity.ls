RegisterActivity {
  is: 'fillblanksocial-activity'
  properties: {
    sentence: {
      type: String
      value: 'My favorite color is ⬜⬜⬜⬜⬜.'
    }
    fillinblank: {
      type: String
      value: 'fill in the blank'
    }
    entered: {
      type: String
      value: '⬜⬜⬜⬜⬜'
    }
    filledsentence: {
      type: String
      computed: 'compute_filledsentence(sentence, entered)'
      observer: 'filledsentence_changed'
    }
    wordoptions: {
      type: Array
      value: []
    }
  }
  filledsentence_changed: (newval, oldval) ->
    if not this.firstplay
      return
    this.$$('#sentence').playSentence()
  compute_filledsentence: (sentence, entered) ->
    return sentence.split('⬜⬜⬜⬜⬜').join(entered)
  fillword: (evt) ->
    word = ''
    for elem in evt.path
      if elem.word?
        word = elem.word
        break
    this.entered = word
    setSocialSharingData('fillblanksocial', {entered: word})
    setTimeout ~>
      this.fire 'task-freeplay', this
    , 0
  ready: ->
    if this.wordoptions.length == 0
      this.wordoptions = getFeedWordList()
    setTimeout ~>
      this.$$('#sentence').playSentence()
      this.firstplay = true
    , 100
  /*
  ready: ->
    setTimeout ~>
      this.fire 'task-freeplay', this
    , 0
    setTimeout ~>
      this.$$('#sentence').playSentence()
    , 100
  */
}