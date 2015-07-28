require! {
  fs
  path
  child_process
  file
}

pubdir = path.join(__dirname, '..', 'public')
outfile = path.join(pubdir, 'cache.appcache')
fd = fs.openSync outfile, 'w'
log = (line) ->
  fs.writeSync fd, line + '\n'

filelist = []
file.walkSync pubdir, (dirpath, dirs, files) ->
  for filename in files
    filelist.push('/' + file.path.relativePath(pubdir, path.join(dirpath, filename)).split('\\').join('/'))
log 'CACHE MANIFEST'
#log '# rev 2015-06-01 16:48:11 +0000'
log '# random value: ' + Math.random()
log ''
log 'CACHE:'
patterns = ['\.html$', '\.js$', '\.css$', '\.png$', '\.svg$', '\.mp3$', '\.woff2$', '\.woff$', '\.ttf$'].map((x) -> new RegExp(x))
for filename in filelist
  if patterns.map((x) -> x.test(filename)).reduce((||), false)
    log filename
log ''
log 'NETWORK:'
log '*'
