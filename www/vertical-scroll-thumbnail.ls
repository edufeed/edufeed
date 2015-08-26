Polymer {
  is: 'vertical-scroll-thumbnail'
  properties: {
    items: {
      type: Array
      #value: [
      #  {itemtype: 'video', data: {}}
      #  {}
      #]
    }
    poster: {
      type: String
      value: ''
      notify: true
    }
    finishedby: {
      type: Array
      value: []
      notify: true
    }
  }
}
