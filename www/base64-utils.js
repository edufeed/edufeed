// http://www.henryalgus.com/reading-binary-files-using-jquery-ajax/
function _fetchBlob(uri, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', uri, true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    if (this.status == 200) {
      var blob = this.response;
      if (callback) {
        callback(blob);
      }
    }
  };
  xhr.send();
};

// http://stackoverflow.com/a/9458996/128597
function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

function _fetchAsBase64(uri, callback) {
  _fetchBlob(uri, function(blob) {
    callback(_arrayBufferToBase64(blob))
  })
}

function fetchAsDataURL(uri, callback) {
  var mimetype = ''
  if (/\.mp3$/.test(uri)) {
    mimetype = 'audio/mpeg'
  }
  else {
    console.log('fetchAsDataURL on unknown data type: ' + uri)
    alert('fetchAsDataURL on unknown data type: ' + uri)
    return
  }
  _fetchAsBase64(uri, function(data) {
    callback('data:' + mimetype + ';base64,' + data)
  })
}
