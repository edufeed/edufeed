require! {
  glob
  fs
}

process.chdir('www')
files = glob.sync('**/*.mp3')
output = {}
for file in files
  output[file] = 'data:audio/mpeg;base64,' + new Buffer(fs.readFileSync(file)).toString('base64')
fs.writeFileSync 'filecache.js', 'filecache = ' + JSON.stringify(output, null, 2)
