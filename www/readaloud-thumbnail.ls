RegisterActivity {
  is: 'readaloud-thumbnail'
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
    return [this.splitWordsInSentence(sentences[0])]
}