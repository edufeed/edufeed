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
  ready: ->
    setTimeout ~>
      this.fire 'task-freeplay', this
    , 0
}