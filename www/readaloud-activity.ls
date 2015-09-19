RegisterActivity {
  is: 'readaloud-activity'
  properties: {
    sentences: {
      type: Array
      value: [
        'Why do elephants never forget?'
        'Because nobody ever tells them anything!'
      ]
    }
  }
  getSentenceId: (sentenceidx) ->
    return "sentence_#{sentenceidx}"
  ready: ->
    setTimeout ~>
      this.fire 'task-freeplay', this
    , 0
    setTimeout ~>
      #this.$$('#' + this.getSentenceId(0)).playSentenceAtOnce()
      synthesize_word 'touch the speaker buttons to hear the joke'
    , 100
}