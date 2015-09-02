(function(){
  var fs, os, path, child_process, is_windows, videolists, ref$, which, exec, rm, ls, mv, get_ffmpegcmd, make_thumbnail, get_pipcmd, install_you_get, cleanup_and_exit, cleanup_tmpdir, download_youtube, main;
  fs = require('fs');
  os = require('os');
  path = require('path');
  child_process = require('child_process');
  is_windows = os.platform() === 'win32';
  videolists = require('../www/sample_feed_items').getFeedVideoLists();
  ref$ = require('shelljs'), which = ref$.which, exec = ref$.exec, rm = ref$.rm, ls = ref$.ls, mv = ref$.mv;
  get_ffmpegcmd = function(){
    if (is_windows) {
      return 'windows_binaries\\ffmpeg.exe';
    }
    if (which('ffmpeg')) {
      return 'ffmpeg';
    }
    console.log('could not find ffmpeg command - please install ffmpeg');
    return process.exit();
  };
  make_thumbnail = function(videoid, offset_time){
    var thumbnailfile, videofile, ffmpegcmd;
    if (!fs.existsSync('www/videos/youtube_thumbnails')) {
      fs.mkdirSync('www/videos/youtube_thumbnails');
    }
    thumbnailfile = "www/videos/youtube_thumbnails/" + videoid + ".png";
    if (fs.existsSync(thumbnailfile)) {
      console.log("thumbnail already exists: " + thumbnailfile);
      return;
    }
    videofile = "www/videos/youtube/" + videoid + ".mp4";
    if (!fs.existsSync(videofile)) {
      console.log("video file does not exist: " + videofile);
    }
    if (offset_time == null) {
      offset_time = 4;
    }
    ffmpegcmd = get_ffmpegcmd();
    return exec(ffmpegcmd + " -itsoffset -" + offset_time + " -i \"" + videofile + "\" -vcodec png -vframes 1 -an -f rawvideo -s 350x350 -y \"" + thumbnailfile + "\"");
  };
  get_pipcmd = function(){
    if (which('pip3')) {
      return 'pip3';
    }
    if (which('python3')) {
      return 'python3 -m pip';
    }
    if (which('py')) {
      return 'py -3 ';
    }
    console.log('could not find pip for python 3 - please install python 3');
    return process.exit();
  };
  install_you_get = function(){
    var pipcmd;
    if (!which('you-get')) {
      console.log('you-get not installed, installing');
      pipcmd = get_pipcmd();
      return exec(pipcmd + " install you-get");
    }
  };
  cleanup_and_exit = function(){
    cleanup_tmpdir();
    return process.exit();
  };
  cleanup_tmpdir = function(){
    if (fs.existsSync('tmpdir')) {
      return rm('-rf', 'tmpdir');
    }
  };
  download_youtube = function(videoid){
    var targetfile, outfiles;
    targetfile = "www/videos/youtube/" + videoid + ".mp4";
    if (!fs.existsSync('www/videos/youtube')) {
      fs.mkdirSync('www/videos/youtube');
    }
    if (fs.existsSync(targetfile)) {
      console.log("already downloaded: " + targetfile);
      return;
    }
    install_you_get();
    cleanup_tmpdir();
    console.log("downloading https://www.youtube.com/watch?v=" + videoid);
    exec("you-get -F 18 --output-dir tmpdir \"https://www.youtube.com/watch?v=" + videoid + "\"");
    outfiles = ls('tmpdir/*.mp4');
    if (outfiles.length === 0) {
      console.log("failed to download: " + videoid);
      cleanup_and_exit();
    }
    if (outfiles.length > 1) {
      console.log("too many downloaded files: " + videoid);
      console.log(outfiles);
      cleanup_and_exit();
    }
    mv(outfiles[0], targetfile);
    return cleanup_tmpdir();
  };
  main = function(){
    var python_scripts_dir, listname, ref$, videolist, lresult$, offset_time, i$, len$, videoid, results$ = [];
    if (!fs.existsSync('www/videos')) {
      console.log('must be run from the root edufeed directory - cannot find www/videos');
      return;
    }
    if (is_windows) {
      python_scripts_dir = ls('C:/Python3*').sort().reverse()[0] + '/Scripts';
      if (fs.existsSync(python_scripts_dir)) {
        process.env.PATH += ';' + python_scripts_dir.split('/').join(path.sep);
      }
    }
    for (listname in ref$ = videolists) {
      videolist = ref$[listname];
      lresult$ = [];
      offset_time = 4;
      if (listname === 'numbervideo') {
        offset_time = 45;
      }
      for (i$ = 0, len$ = videolist.length; i$ < len$; ++i$) {
        videoid = videolist[i$];
        download_youtube(videoid);
        lresult$.push(make_thumbnail(videoid, offset_time));
      }
      results$.push(lresult$);
    }
    return results$;
  };
  main();
}).call(this);
