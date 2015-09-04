Polymer {
  is: 'readaloud-text'
  properties: {
    text: {
      type: String
      value: 'Why do elephants never forget?'
    }
    wordlist: {
      type: Array
      computed: 'splitWordsInSentence(text)'
    }
    blankstring: {
      type: String
      value: '⬜⬜⬜⬜⬜'
    }
    fillinblank: {
      type: String
      value: 'fill in the blank'
    }
    nomicrophone: {
      type: Boolean
      value: false
      observer: 'nomicrophone_changed'
    }
  }
  S: (pattern) ->
    return $(this.$$(pattern))
  nomicrophone_changed: ->
    if this.nomicrophone == true
      this.S('#microphonedisplay').hide()
      this.S('#lmargindiv').css('margin-left', '0px')
    else
      this.S('#microphonedisplay').show()
      this.S('#lmargindiv').css('margin-left', '70px')
  splitWordsInSentence: (sentence) ->
    output = []
    curword = []
    end_curword = ->
      if curword.length == 0
        return
      output.push curword.join('')
      curword := []
    for c in sentence
      if [' ', '?', '.', '!', ':'].indexOf(c) != -1
        end_curword()
        output.push c
      else
        curword.push c
    end_curword()
    return output
  getWordId: (wordidx) ->
    return "word_#{wordidx}"
  playSentence: ->
    self = this
    wordlist = this.wordlist
    playlist = []
    for word in wordlist
      if word == self.blankstring
        playlist.push(self.fillinblank)
      else
        playlist.push(word.toLowerCase())
    play_multiple_sounds playlist, {
      startword: (wordidx, word) ->
        self.S('.highlighted').removeClass('highlighted')
        wordspan = self.S('#' + self.getWordId(wordidx))
        wordspan.addClass('highlighted')
      done: ->
        self.S('.highlighted').removeClass('highlighted')
    }
  sentenceClicked: (obj, evt) ->
    this.playSentence()
  playWord: (wordidx) ->
    self = this
    word = this.wordlist[wordidx]
    self.S('.highlighted').removeClass('highlighted')
    wordspan = self.S('#' + self.getWordId(wordidx))
    wordspan.addClass('highlighted')
    synthesize_word word.toLowerCase(), ->
      self.S('.highlighted').removeClass('highlighted')
  wordClicked: (obj, evt) ->
    {wordidx} = obj.target
    this.playWord(wordidx)
  #computevideoid: (videosrc) ->
  #  return videosrc.split('http://www.youtube.com/embed/').join('')
  /*
  S: (pattern) ->
    $(this.$$(pattern))
  ready: ->
    this.S('#hoverspan').hover ->
      $(this).css 'background-color', 'yellow'
  showAlert: ->
    alert 'button has been clicked'
  finishTask: ->
    this.fire 'task-finished', this
  */
}