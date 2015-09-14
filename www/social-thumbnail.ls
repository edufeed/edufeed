Polymer {
  is: 'social-thumbnail'
  properties: {
    poster: {
      type: String
      value: ''
      #notify: true
    }
    finishedby: {
      type: Array
      value: []
      #notify: true
    }
    myname: {
      type: String
      value: ''
    }
    finished: {
      type: Boolean
      computed: 'compute_finished(finishedby, myname)'
      observer: 'finished_changed'
    }
  }
  compute_finished: (finishedby, myname) ->
    if not finishedby? or not myname?
      return false
    return finishedby.indexOf(myname) >= 0
  finished_changed: (finished) ->
    if finished
      this.$$('#doneicon').style.display = 'inline'
    else
      this.$$('#doneicon').style.display = 'none'
}
