RegisterActivity {
  is: 'readaloud-activity'
  properties: {
    sentences: {
      type: Array
      value: [
        'Hello world'
        'World hellos you'
      ]
    }
    sentences_split: {
      type: Array
      computed: 'splitWordsInSentences(sentences)'
    }
  }
  splitWordsInSentence: (sentence) ->
    output = []
    curword = []
    end_curword = ->
      if curword.length == 0
        return
      output.push curword.join('')
      curword := []
    for c in sentence
      if c == ' '
        end_curword()
        output.push c
      else
        curword.push c
    end_curword()
    return output
  splitWordsInSentences: (sentences) ->
    return [this.splitWordsInSentence(sentence) for sentence in sentences]
  wordClicked: (obj, evt) ->
    {wordidx, sentenceidx} = obj.target
    console.log this.sentences_split[sentenceidx][wordidx]
    
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