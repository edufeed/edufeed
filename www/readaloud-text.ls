RegisterActivity {
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
  }
  S: (pattern) ->
    return $(this.$$(pattern))
  splitWordsInSentence: (sentence) ->
    output = []
    curword = []
    end_curword = ->
      if curword.length == 0
        return
      output.push curword.join('')
      curword := []
    for c in sentence
      if [' ', '?', '.', '!'].indexOf(c) != -1
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
    playlist = [word.toLowerCase() for word in wordlist]
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