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
    sentences_split: {
      type: Array
      computed: 'splitWordsInSentences(sentences)'
    }
  }
  S: (pattern) ->
    return $(this.$$(pattern))
  ready: ->
    setTimeout ~>
      this.fire 'task-freeplay', this
    , 0
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
  splitWordsInSentences: (sentences) ->
    return [this.splitWordsInSentence(sentence) for sentence in sentences]
  getWordId: (sentenceidx, wordidx) ->
    return "sentence_#{sentenceidx}_word_#{wordidx}"
  sentenceClicked: (obj, evt) ->
    {sentenceidx} = obj.target
    self = this
    wordlist = this.sentences_split[sentenceidx]
    playlist = [word.toLowerCase() for word in wordlist]
    play_multiple_sounds playlist, {
      startword: (wordidx, word) ->
        self.S('.highlighted').removeClass('highlighted')
        wordspan = self.S('#' + self.getWordId(sentenceidx, wordidx))
        wordspan.addClass('highlighted')
      done: ->
        self.S('.highlighted').removeClass('highlighted')
    }
  wordClicked: (obj, evt) ->
    {wordidx, sentenceidx} = obj.target
    console.log this.sentences_split[sentenceidx][wordidx]
    self = this
    word = this.sentences_split[sentenceidx][wordidx]
    self.S('.highlighted').removeClass('highlighted')
    wordspan = self.S('#' + self.getWordId(sentenceidx, wordidx))
    wordspan.addClass('highlighted')
    synthesize_word word, ->
      self.S('.highlighted').removeClass('highlighted')
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