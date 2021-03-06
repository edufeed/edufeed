(function(){
  Polymer({
    is: 'speech-recognition',
    properties: {
      width: {
        type: String,
        value: 100,
        notify: true
      },
      height: {
        type: String,
        value: 100,
        notify: true
      },
      language: {
        type: String,
        value: 'en-US'
      },
      isrecording: {
        type: Boolean,
        value: false,
        observer: 'isrecordingChanged'
      }
    },
    endRecording: function(){
      var recognition, candidates, res$, i$, ref$, len$, x;
      if (this.recognition == null) {
        return;
      }
      recognition = this.recognition;
      recognition.stop();
      this.isrecording = false;
      if (this.results == null) {
        return;
      }
      res$ = [];
      for (i$ = 0, len$ = (ref$ = this.results[0]).length; i$ < len$; ++i$) {
        x = ref$[i$];
        res$.push(x.transcript);
      }
      candidates = res$;
      if (this.onresults != null) {
        return this.onresults(candidates);
      }
    },
    startRecording: function(){
      var self, recognition;
      self = this;
      console.log(this.language);
      recognition = this.recognition = new webkitSpeechRecognition();
      recognition.lang = this.language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 10;
      recognition.onstart = function(event){
        return self.isrecording = true;
      };
      recognition.onresult = function(event){
        console.log(event.results);
        self.results = event.results;
        if (event.results[0].isFinal) {
          return self.endRecording();
        }
      };
      return recognition.start();
    },
    buttonClicked: function(){
      if (this.isrecording) {
        return this.endRecording();
      } else {
        return this.startRecording();
      }
    },
    isrecordingChanged: function(newval, oldval){
      if (newval === oldval) {
        return;
      }
      if (newval) {
        return this.$$('#speechicon').src = 'speech-recognition-stop.webp';
      } else {
        return this.$$('#speechicon').src = 'speech-recognition.webp';
      }
    }
  });
}).call(this);
