RegisterActivity {
  is: 'fillblanksocial-activity'
  properties: {
    sentence: {
      type: String
      value: 'My favorite color is ⬜⬜⬜⬜⬜.'
    }
    howaboutyou: {
      type: String
      value: 'How about you?'
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
    firstfilledsentence: {
      type: String
      computed: 'compute_firstfilledsentence(sentence, firstentered)'
    }
    firstentered: {
      type: String
      value: '⬜⬜⬜⬜⬜'
    }
    firstsentence: {
      type: String
      computed: 'compute_firstsentence(firstfilledsentence, social, howaboutyou)'
    }
    wordoptions: {
      type: Array
      value: []
    }
  }
  saySentence1: ->
    this.$$('#sentence1').playSentence()
  saySentence2: ->
    this.$$('#sentence2').playSentence()
  compute_firstfilledsentence: (sentence, firstentered) ->
    return sentence.split('⬜⬜⬜⬜⬜').join(firstentered)
  compute_firstsentence: (firstfilledsentence, social, howaboutyou) ->
    return "#{capitalizeFirstLetter(social.poster)} says: #{firstfilledsentence} #{howaboutyou}"
  filledsentence_changed: (newval, oldval) ->
    if not this.firstplay
      return
    this.$$('#sentence2').playSentence()
  compute_filledsentence: (sentence, entered) ->
    return sentence.split('⬜⬜⬜⬜⬜').join(entered)
  fillword: (evt) ->
    word = ''
    for elem in evt.path
      if elem.word?
        word = elem.word
        break
    this.entered = word
    setSocialSharingData('fillblanksocial', {firstentered: word})
    setTimeout ~>
      this.fire 'task-freeplay', this
    , 0
  ready: ->
    if this.wordoptions.length == 0
      this.wordoptions = getFeedWordList()
    setTimeout ~>
      this.$$('#sentence1').playSentence()
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