var
gulp     = require('gulp'),
babel    = require('gulp-babel'),
composer = require('gulp-uglify/composer'),
eslint   = require('gulp-eslint'),
rename   = require('gulp-rename'),
pump     = require('pump'),
uglify   = require('uglify-es'),

//  Uglify + ES6+
minify   = composer(uglify, console);

//  Task for finding errors and problems in Seht
gulp.task('eslint', () => {
  pump([
    gulp.src('src/seht.js'),
    eslint(),
    eslint.format(),
    eslint.failAfterError()
  ]);
});

//  Task for minifying the
//  ES6+ friendly version of Seht
gulp.task('minify', () => {
  pump([
    gulp.src('src/seht.js'),
    minify(),
    rename('seht.min.js'),
    gulp.dest('dist')
  ]);
});

//  Task for running Seht through Babel,
//  and then minifying it for older browsers
gulp.task('babel', () => {
  pump([
    gulp.src('src/seht.js'),
    babel(),
    minify(),
    rename('seht.babel.js'),
    gulp.dest('dist')
  ]);
});