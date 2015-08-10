require! {
  'gulp'
  'gulp-changed'
  'gulp-util'
  'gulp-print'
  'gulp-livescript'
}

lspattern = ['*.ls', '**/*.ls', '!gulpfile.ls']
gulp.task 'livescript', ->
  return gulp.src(lspattern)
  .pipe(gulp-changed('.', {extension: '.js'}))
  .pipe(gulp-livescript({bare: false}))
  .on('error', gulp-util.log)
  .pipe(gulp-print())
  .pipe(gulp.dest('.'))

gulp.task 'build', ['livescript']

gulp.task 'watch', ->
  gulp.watch lspattern, ['build']

gulp.task 'default', ['build', 'watch']