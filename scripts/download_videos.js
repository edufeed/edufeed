(function(){
  var fs, child_process, videolists, ref$, which, exec, rm, ls, mv, get_pipcmd, install_you_get, cleanup_and_exit, cleanup_tmpdir, download_youtube, main;
  fs = require('fs');
  child_process = require('child_process');
  videolists = require('../www/sample_feed_items').getFeedVideoLists();
  ref$ = require('shelljs'), which = ref$.which, exec = ref$.exec, rm = ref$.rm, ls = ref$.ls, mv = ref$.mv;
  if (fs.existsSync('C:\\Python34\\Scripts')) {
    process.env.PATH += ';C:\\Python34\\Scripts';
  }
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
    console.log('could not find pip command - is python 3 installed?');
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
    if (fs.existsSync(targetfile)) {
      console.log("already downloaded: " + targetfile);
      return;
    }
    install_you_get();
    cleanup_tmpdir();
    exec("you-get --output-dir tmpdir https://www.youtube.com/watch?v=" + videoid);
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
    var listname, ref$, videolist, lresult$, i$, len$, videoid, results$ = [];
    if (!fs.existsSync('www/videos')) {
      console.log('must be run from the root edufeed directory - cannot find www/videos');
      return;
    }
    if (!fs.existsSync('www/videos/youtube')) {
      fs.mkdirSync('www/videos/youtube');
    }
    for (listname in ref$ = videolists) {
      videolist = ref$[listname];
      lresult$ = [];
      for (i$ = 0, len$ = videolist.length; i$ < len$; ++i$) {
        videoid = videolist[i$];
        lresult$.push(download_youtube(videoid));
      }
      results$.push(lresult$);
    }
    return results$;
  };
  main();
}).call(this);
