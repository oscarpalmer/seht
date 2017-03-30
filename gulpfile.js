var
gulp   = require('gulp'),
jshint = require('gulp-jshint'),
pump   = require('pump'),
uglify = require('gulp-uglify');

// Task for finding errors and problems in Seht
gulp.task('jshint', function () {
  pump([
    gulp.src('src/seht.js'),
    jshint(),
    jshint.reporter('default')
  ]);
});

// Task for minifying Seht
gulp.task('uglify', function () {
  pump([
    gulp.src('src/seht.js'),
    uglify(),
    gulp.dest('dist')
  ]);
});