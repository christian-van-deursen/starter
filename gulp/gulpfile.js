// Define packages
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload');

// Store commonly used paths inside an object for easy configuration
var paths = {
  'src': {
    'SassFile': 'sass/style.scss',
    'CssDir': 'sass/',
    'JsDir': 'js/'
  },
  'dest': {
    'CssDir': '',
    'JsDir': 'js/built/'
  }
};

/** Task for processing styles
 *
 * This task will do the following:
 * 1. Compile the main SCSS file to CSS
 * 2. Add browser prefixes
 * 3. Write the unminified file to the destination directory
 * 4. Rename the file to 'FILENAME.min.css'
 * 5. Minify the CSS
 * 6. Write the minified file to the destination directory
 */
gulp.task('process-styles', function(){
  return sass(paths.src.CssDir + '**/*.scss', {
    sourcemap: true,
    style: 'expanded'
  })
    .on('error', sass.logError)
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(paths.dest.CssDir))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.dest.CssDir))
    .pipe(livereload());
});

/** Task for processing javascript
 *
 * This task will do the following:
 * 1. Concatenate all .js files inside the scripts directory
 * 2. Write the unminified file to the destination directory
 * 4. Rename the file to 'FILENAME.min.js'
 * 2. Minify the concatenated .js file
 * 3. Write the minified file to the destination directory
 */
gulp.task('process-scripts', function(){
  return gulp.src(paths.src.JsDir + '**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.dest.JsDir))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest.JsDir))
    .pipe(livereload());
});

/** Task that monitors files for changes and performs preconfigured tasks
 *
 * 1. runs the 'process-styles' task when .scss files have changed
 * 2. Runs the 'process-scripts' task when .js files have changed
 */
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.src.CssDir + '**/*.scss', ['process-styles']);
  gulp.watch(paths.src.JsDir + '**/*.js', ['process-scripts']);
});
