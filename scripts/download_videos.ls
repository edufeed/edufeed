require! {
  fs
  os
  path
  child_process
}

is_windows = os.platform() == 'win32'
videolists = require('../www/sample_feed_items').getFeedVideoLists()
{which, exec, rm, ls, mv} = require 'shelljs'

get_ffmpegcmd = ->
  if is_windows
    return 'windows_binaries\\ffmpeg.exe'
  if which 'ffmpeg'
    return 'ffmpeg'
  console.log 'could not find ffmpeg command - please install ffmpeg'
  process.exit()

make_thumbnail = (videoid, offset_time) ->
  if not fs.existsSync 'www/videos/youtube_thumbnails'
    fs.mkdirSync 'www/videos/youtube_thumbnails'
  thumbnailfile = "www/videos/youtube_thumbnails/#{videoid}.png"
  if fs.existsSync thumbnailfile
    console.log "thumbnail already exists: #{thumbnailfile}"
    return
  videofile = "www/videos/youtube/#{videoid}.mp4"
  if not fs.existsSync videofile
    console.log "video file does not exist: #{videofile}"
  if not offset_time?
    offset_time = 4
  ffmpegcmd = get_ffmpegcmd()
  exec "#{ffmpegcmd} -itsoffset -#{offset_time} -i \"#{videofile}\" -vcodec png -vframes 1 -an -f rawvideo -s 350x350 -y \"#{thumbnailfile}\""

get_pipcmd = ->
  if which 'pip3'
    return 'pip3'
  if which 'python3'
    return 'python3 -m pip'
  if which 'py'
    return 'py -3 '
  console.log 'could not find pip for python 3 - please install python 3'
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
  if not fs.existsSync 'www/videos/youtube'
    fs.mkdirSync 'www/videos/youtube'
  if fs.existsSync targetfile
    console.log "already downloaded: #{targetfile}"
    return
  install_you_get()
  cleanup_tmpdir()
  console.log "downloading https://www.youtube.com/watch?v=#{videoid}"
  exec "you-get -F 18 --output-dir tmpdir \"https://www.youtube.com/watch?v=#{videoid}\""
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
  if is_windows
    python_scripts_dir = ls('C:/Python3*').sort().reverse()[0] + '/Scripts'
    if fs.existsSync(python_scripts_dir)
      process.env.PATH += ';' + python_scripts_dir.split('/').join(path.sep)
  #exec('you-get --info https://www.youtube.com/watch?v=VW2MREqE')
  #return
  for listname,videolist of videolists
    offset_time = 4
    if listname == 'numbervideo'
      offset_time = 45
    for videoid in videolist
      download_youtube videoid
      make_thumbnail videoid, offset_time

main()
