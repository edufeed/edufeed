Polymer {
  is: 'speech-recognition'
  properties: {
    width: {
      type: String
      value: 100
      notify: true
    }
    height: {
      type: String
      value: 100
      notify: true
    }
    language: {
      type: String
      value: 'en-US'
    }
    isrecording: {
      type: Boolean
      value: false
      observer: 'isrecordingChanged'
    }
  }
  endRecording: ->
    if not this.recognition?
      return
    recognition = this.recognition
    recognition.stop()
    this.isrecording = false
    if not this.results?
      return
    #console.log event.results[0]
    candidates = [x.transcript for x in this.results[0]]
    #console.log candidates
    if this.onresults?
      this.onresults(candidates)
  startRecording: ->
    self = this
    console.log this.language
    recognition = this.recognition = new webkitSpeechRecognition()
    recognition.lang = this.language
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 10
    recognition.onstart = (event) ->
      self.isrecording = true
    recognition.onresult = (event) ->
      console.log event.results
      self.results = event.results
      if event.results[0].isFinal
        self.endRecording()
    recognition.start()
  buttonClicked: ->
    if this.isrecording
      this.endRecording()
    else
      this.startRecording()
  isrecordingChanged: (newval, oldval) ->
    if newval == oldval
      return
    if newval
      this.$$('#speechicon').src = 'speech-recognition-stop.webp'
    else
      this.$$('#speechicon').src = 'speech-recognition.webp'
}
