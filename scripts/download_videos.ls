require! {
  fs
  child_process
}

videolists = require('../www/sample_feed_items').getFeedVideoLists()
{which, exec, rm, ls, mv} = require 'shelljs'

if fs.existsSync('C:\\Python34\\Scripts')
  process.env.PATH += ';C:\\Python34\\Scripts'

get_pipcmd = ->
  if which 'pip3'
    return 'pip3'
  if which 'python3'
    return 'python3 -m pip'
  if which 'py'
    return 'py -3 '
  console.log 'could not find pip command - is python 3 installed?'
  process.exit()

install_you_get = ->
  if not which 'you-get'
    console.log 'you-get not installed, installing'
    pipcmd = get_pipcmd()
    exec "#{pipcmd} install you-get"

cleanup_and_exit = ->
  cleanup_tmpdir()
  process.exit()

cleanup_tmpdir = ->
  if fs.existsSync('tmpdir')
    rm '-rf', 'tmpdir'

download_youtube = (videoid) ->
  targetfile = "www/videos/youtube/#{videoid}.mp4"
  if fs.existsSync targetfile
    console.log "already downloaded: #{targetfile}"
    return
  install_you_get()
  cleanup_tmpdir()
  exec "you-get --output-dir tmpdir https://www.youtube.com/watch?v=#{videoid}"
  outfiles = ls 'tmpdir/*.mp4'
  if outfiles.length == 0
    console.log "failed to download: #{videoid}"
    cleanup_and_exit()
  if outfiles.length > 1
    console.log "too many downloaded files: #{videoid}"
    console.log outfiles
    cleanup_and_exit()
  mv outfiles[0], targetfile
  cleanup_tmpdir()

main = ->
  if not fs.existsSync 'www/videos'
    console.log 'must be run from the root edufeed directory - cannot find www/videos'
    return
  if not fs.existsSync 'www/videos/youtube'
    fs.mkdirSync 'www/videos/youtube'
  for listname,videolist of videolists
    for videoid in videolist
      download_youtube videoid

main()
